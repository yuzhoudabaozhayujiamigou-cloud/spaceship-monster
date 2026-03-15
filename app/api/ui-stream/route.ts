import { NextRequest } from "next/server";

type UIDoneSource = "api" | "fallback" | "error";
type UIErrorCode = "invalid_input" | "rate_limited" | "internal_error";
type UIGranularity = "brief" | "balanced" | "detailed";
type UIErrorEvent = {
  type: "ui.error";
  code: UIErrorCode;
  message: string;
  retryAfterMs?: number;
  details?: Record<string, unknown>;
};

type UIStreamEvent =
  | { type: "ui.init"; title: string; layout?: string }
  | { type: "ui.block"; id: string; blockType: string; [k: string]: unknown }
  | { type: "ui.patch"; id: string; patch: Record<string, unknown> }
  | UIErrorEvent
  | { type: "ui.done"; source: UIDoneSource };

type OpenAIStreamChunk = {
  choices?: Array<{
    delta?: {
      content?: string;
    };
  }>;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const encoder = new TextEncoder();
const MAX_PROMPT_CHARS = readPositiveIntEnv("UI_STREAM_MAX_PROMPT_CHARS", 2000);
const RATE_LIMIT_WINDOW_MS = readPositiveIntEnv("UI_STREAM_RATE_LIMIT_WINDOW_MS", 10_000);
const RATE_LIMIT_MAX_REQUESTS = readPositiveIntEnv("UI_STREAM_RATE_LIMIT_MAX_REQUESTS", 6);
const KEEPALIVE_INTERVAL_MS = readPositiveIntEnv("UI_STREAM_KEEPALIVE_INTERVAL_MS", 15_000);
const SESSION_HEADER = "x-ui-session-id";
const SESSION_COOKIE = "ui_stream_session";
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const GRANULARITY_VALUES: ReadonlySet<UIGranularity> = new Set(["brief", "balanced", "detailed"]);
const CLIENT_ABORT_ERROR = "client_aborted";

const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
} as const;

const ipBuckets = new Map<string, RateLimitBucket>();
const sessionBuckets = new Map<string, RateLimitBucket>();

function toSSE(event: UIStreamEvent): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
}

function readPositiveIntEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function createErrorEvent(
  code: UIErrorCode,
  message: string,
  options?: { retryAfterMs?: number; details?: Record<string, unknown> },
): UIErrorEvent {
  return {
    type: "ui.error",
    code,
    message,
    ...(typeof options?.retryAfterMs === "number" ? { retryAfterMs: options.retryAfterMs } : {}),
    ...(options?.details ? { details: options.details } : {}),
  };
}

function errorSSEResponse(
  event: UIErrorEvent,
  options?: {
    status?: number;
    headers?: Record<string, string>;
  },
): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(toSSE(event));
      controller.enqueue(toSSE({ type: "ui.done", source: "error" }));
      controller.close();
    },
  });

  return new Response(stream, {
    status: options?.status ?? 400,
    headers: {
      ...SSE_HEADERS,
      ...(options?.headers || {}),
    },
  });
}

function getClientIp(req: NextRequest): string | null {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return null;
}

function parseAndValidateBody(rawBody: string):
  | { ok: true; prompt: string; granularity: UIGranularity; bodySessionId: unknown }
  | { ok: false; error: UIErrorEvent } {
  if (!rawBody.trim()) {
    return {
      ok: false,
      error: createErrorEvent("invalid_input", "`prompt` is required."),
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return {
      ok: false,
      error: createErrorEvent("invalid_input", "Request body must be valid JSON."),
    };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      ok: false,
      error: createErrorEvent("invalid_input", "Request body must be a JSON object."),
    };
  }

  const payload = parsed as Record<string, unknown>;
  if (typeof payload.prompt !== "string") {
    return {
      ok: false,
      error: createErrorEvent("invalid_input", "`prompt` must be a string."),
    };
  }

  const prompt = payload.prompt.trim();
  if (!prompt) {
    return {
      ok: false,
      error: createErrorEvent("invalid_input", "`prompt` cannot be empty."),
    };
  }

  if (prompt.length > MAX_PROMPT_CHARS) {
    return {
      ok: false,
      error: createErrorEvent("invalid_input", "`prompt` exceeds maximum length.", {
        details: {
          maxChars: MAX_PROMPT_CHARS,
          actualChars: prompt.length,
        },
      }),
    };
  }

  const rawGranularity = payload.granularity;
  if (rawGranularity !== undefined && typeof rawGranularity !== "string") {
    return {
      ok: false,
      error: createErrorEvent("invalid_input", "`granularity` must be one of: brief, balanced, detailed."),
    };
  }
  const normalizedGranularity = rawGranularity?.trim() || "balanced";
  if (!GRANULARITY_VALUES.has(normalizedGranularity as UIGranularity)) {
    return {
      ok: false,
      error: createErrorEvent("invalid_input", "`granularity` must be one of: brief, balanced, detailed."),
    };
  }
  const granularity = normalizedGranularity as UIGranularity;

  return {
    ok: true,
    prompt,
    granularity,
    bodySessionId: payload.sessionId,
  };
}

function resolveAndValidateSessionId(
  req: NextRequest,
  bodySessionId: unknown,
): { ok: true; sessionId: string | null } | { ok: false; error: UIErrorEvent } {
  const headerSessionId = req.headers.get(SESSION_HEADER);
  const cookieSessionId = req.cookies.get(SESSION_COOKIE)?.value;
  const candidate = headerSessionId ?? cookieSessionId ?? bodySessionId;

  if (candidate === undefined || candidate === null) {
    return { ok: true, sessionId: null };
  }
  if (typeof candidate !== "string") {
    return {
      ok: false,
      error: createErrorEvent("invalid_input", "`sessionId` must be a string."),
    };
  }

  const sessionId = candidate.trim();
  if (!sessionId) {
    return { ok: true, sessionId: null };
  }
  if (!SESSION_ID_PATTERN.test(sessionId)) {
    return {
      ok: false,
      error: createErrorEvent("invalid_input", "`sessionId` must match [A-Za-z0-9_-] and be 1-64 chars."),
    };
  }

  return { ok: true, sessionId };
}

function consumeFixedWindow(
  buckets: Map<string, RateLimitBucket>,
  key: string,
  now: number,
): { limited: boolean; retryAfterMs: number } {
  const existing = buckets.get(key);
  let bucket: RateLimitBucket;
  if (!existing || now >= existing.resetAt) {
    bucket = {
      count: 0,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    };
  } else {
    bucket = existing;
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    buckets.set(key, bucket);
    return {
      limited: true,
      retryAfterMs: Math.max(bucket.resetAt - now, 0),
    };
  }

  bucket.count += 1;
  buckets.set(key, bucket);
  return { limited: false, retryAfterMs: 0 };
}

function pruneExpiredBuckets(buckets: Map<string, RateLimitBucket>, now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

function checkRateLimit(
  ip: string | null,
  sessionId: string | null,
): { limited: false } | { limited: true; scope: "ip" | "session"; retryAfterMs: number } {
  const now = Date.now();
  pruneExpiredBuckets(ipBuckets, now);
  pruneExpiredBuckets(sessionBuckets, now);

  if (ip) {
    const ipResult = consumeFixedWindow(ipBuckets, ip, now);
    if (ipResult.limited) {
      return {
        limited: true,
        scope: "ip",
        retryAfterMs: ipResult.retryAfterMs,
      };
    }
  }

  if (sessionId) {
    const sessionResult = consumeFixedWindow(sessionBuckets, sessionId, now);
    if (sessionResult.limited) {
      return {
        limited: true,
        scope: "session",
        retryAfterMs: sessionResult.retryAfterMs,
      };
    }
  }

  return { limited: false };
}

function extractSSEData(frame: string): string | null {
  const lines = frame.replace(/\r/g, "").split("\n");
  const dataLines = lines
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart());
  if (dataLines.length === 0) {
    return null;
  }
  return dataLines.join("\n");
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) {
    throw new Error(CLIENT_ABORT_ERROR);
  }
}

async function streamFallback(send: (event: UIStreamEvent) => void, prompt: string, signal: AbortSignal): Promise<void> {
  const message =
    "Using local fallback stream because OPENAI_API_KEY is not set or the upstream request failed. " +
    "This still exercises incremental ui.patch rendering in real time.";
  const tokens = message.split(" ");
  let content = "";
  for (const token of tokens) {
    throwIfAborted(signal);
    content = content ? `${content} ${token}` : token;
    send({ type: "ui.patch", id: "answer", patch: { content } });
    send({ type: "ui.patch", id: "chars", patch: { value: content.length } });
    await sleep(70);
  }
  throwIfAborted(signal);
  send({ type: "ui.patch", id: "prompt", patch: { content: prompt } });
}

async function streamFromOpenAI(
  send: (event: UIStreamEvent) => void,
  prompt: string,
  granularity: UIGranularity,
  signal: AbortSignal,
): Promise<"api" | "fallback"> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    await streamFallback(send, prompt, signal);
    return "fallback";
  }

  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const upstream = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content: `You are a concise UI assistant. Return plain helpful text only. Avoid markdown tables. Response granularity is ${granularity}.`,
        },
        { role: "user", content: prompt },
      ],
    }),
    signal,
  });

  if (!upstream.ok || !upstream.body) {
    await streamFallback(send, prompt, signal);
    return "fallback";
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";

  while (true) {
    throwIfAborted(signal);
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true }).replace(/\r/g, "");
    let boundary = buffer.indexOf("\n\n");
    while (boundary !== -1) {
      const frame = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      const data = extractSSEData(frame);
      if (data === "[DONE]") {
        break;
      }
      if (data) {
        try {
          const parsed = JSON.parse(data) as OpenAIStreamChunk;
          const delta = parsed.choices?.[0]?.delta?.content;
          if (typeof delta === "string" && delta.length > 0) {
            content += delta;
            send({ type: "ui.patch", id: "answer", patch: { content } });
            send({ type: "ui.patch", id: "chars", patch: { value: content.length } });
          }
        } catch {
          // Ignore malformed SSE chunks from upstream.
        }
      }
      boundary = buffer.indexOf("\n\n");
    }
  }

  return "api";
}

export async function POST(req: NextRequest): Promise<Response> {
  let rawBody = "";
  try {
    rawBody = await req.text();
  } catch {
    return errorSSEResponse(createErrorEvent("invalid_input", "Request body is unreadable."), { status: 400 });
  }

  const parsed = parseAndValidateBody(rawBody);
  if (!parsed.ok) {
    return errorSSEResponse(parsed.error, { status: 400 });
  }

  const session = resolveAndValidateSessionId(req, parsed.bodySessionId);
  if (!session.ok) {
    return errorSSEResponse(session.error, { status: 400 });
  }

  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(ip, session.sessionId);
  if (rateLimit.limited) {
    const retryAfterMs = rateLimit.retryAfterMs;
    return errorSSEResponse(
      createErrorEvent("rate_limited", `Too many requests for this ${rateLimit.scope}. Please retry shortly.`, {
        retryAfterMs,
        details: {
          scope: rateLimit.scope,
          maxRequests: RATE_LIMIT_MAX_REQUESTS,
          windowMs: RATE_LIMIT_WINDOW_MS,
        },
      }),
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.max(Math.ceil(retryAfterMs / 1000), 1)),
        },
      },
    );
  }

  const prompt = parsed.prompt;
  const granularity = parsed.granularity;
  const streamAbortController = new AbortController();
  req.signal.addEventListener(
    "abort",
    () => {
      streamAbortController.abort();
    },
    { once: true },
  );

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let doneSent = false;
      const send = (event: UIStreamEvent) => {
        if (streamAbortController.signal.aborted) {
          throw new Error(CLIENT_ABORT_ERROR);
        }
        controller.enqueue(toSSE(event));
      };
      const sendDoneOnce = (source: UIDoneSource) => {
        if (doneSent) {
          return;
        }
        doneSent = true;
        send({ type: "ui.done", source });
      };
      const keepaliveTimer = setInterval(() => {
        if (streamAbortController.signal.aborted) {
          return;
        }
        try {
          controller.enqueue(encoder.encode(":keepalive\n\n"));
        } catch {
          // Ignore enqueue failures from disconnected clients.
        }
      }, KEEPALIVE_INTERVAL_MS);

      try {
        send({ type: "ui.init", title: "UI Streaming Live Demo", layout: "stack" });
        send({ type: "ui.block", id: "prompt", blockType: "text", title: "Prompt", content: prompt });
        send({
          type: "ui.block",
          id: "granularity",
          blockType: "control",
          title: "Granularity",
          options: ["brief", "balanced", "detailed"],
          value: granularity,
        });
        send({ type: "ui.block", id: "answer", blockType: "text", title: "Assistant", content: "" });
        send({ type: "ui.block", id: "chars", blockType: "kpi", label: "Generated Chars", value: 0 });
        const source = await streamFromOpenAI(send, prompt, granularity, streamAbortController.signal);
        sendDoneOnce(source);
      } catch (error) {
        if (error instanceof Error && error.message === CLIENT_ABORT_ERROR) {
          return;
        }
        try {
          await streamFallback(send, prompt, streamAbortController.signal);
          sendDoneOnce("fallback");
        } catch (fallbackError) {
          if (fallbackError instanceof Error && fallbackError.message === CLIENT_ABORT_ERROR) {
            return;
          }
          send(createErrorEvent("internal_error", "Stream failed unexpectedly."));
          sendDoneOnce("error");
        }
      } finally {
        clearInterval(keepaliveTimer);
        try {
          controller.close();
        } catch {
          // Ignore close errors when stream is already closed.
        }
      }
    },
  });

  return new Response(stream, {
    headers: SSE_HEADERS,
  });
}
