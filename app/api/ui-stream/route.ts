import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type UIDoneSource = "api" | "fallback" | "error";
type UIProviderBranch = "anthropic" | "openai" | "fallback";
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
  | { type: "ui.done"; source: UIDoneSource; provider: UIProviderBranch };

type OpenAIStreamChunk = {
  choices?: Array<{
    delta?: {
      content?: string;
    };
  }>;
};

type AnthropicStreamChunk = {
  type?: string;
  delta?: {
    type?: string;
    text?: string;
  };
  content_block?: {
    type?: string;
    text?: string;
  };
  error?: {
    type?: string;
    message?: string;
  };
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type StreamResult = {
  source: "api" | "fallback";
  provider: UIProviderBranch;
};

type ContentPatcher = (content: string) => void;
type TimelineRow = { step: string; snippet: string; chars: number };

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
const ANTHROPIC_VERSION = "2023-06-01";
const ANTHROPIC_DEFAULT_BASE_URL = "https://api.kimi.com/coding";
const ANTHROPIC_DEFAULT_MODEL = "kimi-for-coding";
const ANTHROPIC_DEFAULT_MAX_TOKENS = 2048;
const PROVIDER_ERROR_SNIPPET_CHARS = 240;
const DASHBOARD_MAX_POINTS = 10;
const DASHBOARD_MAX_TABLE_ROWS = 4;
const DASHBOARD_TOP_TERMS = 5;
const TERM_STOPWORDS = new Set([
  "this",
  "that",
  "with",
  "from",
  "have",
  "will",
  "were",
  "been",
  "into",
  "about",
  "your",
  "their",
  "they",
  "them",
  "there",
  "which",
  "while",
  "where",
  "when",
  "what",
  "just",
  "only",
  "also",
  "than",
  "then",
  "does",
  "done",
  "make",
  "made",
  "using",
  "used",
  "stream",
  "streaming",
  "patch",
  "patches",
]);

const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate, no-transform",
  Pragma: "no-cache",
  Expires: "0",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
} as const;

const ipBuckets = new Map<string, RateLimitBucket>();
const sessionBuckets = new Map<string, RateLimitBucket>();

class ProviderStreamError extends Error {
  readonly provider: "anthropic";
  readonly status?: number;
  readonly bodySnippet?: string;

  constructor(message: string, options?: { status?: number; bodySnippet?: string }) {
    super(message);
    this.name = "ProviderStreamError";
    this.provider = "anthropic";
    this.status = options?.status;
    this.bodySnippet = options?.bodySnippet;
  }
}

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
      controller.enqueue(toSSE({ type: "ui.done", source: "error", provider: "fallback" }));
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

function trimToSnippet(value: string, maxChars: number = PROVIDER_ERROR_SNIPPET_CHARS): string | undefined {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return undefined;
  }
  if (normalized.length <= maxChars) {
    return normalized;
  }
  return `${normalized.slice(0, Math.max(maxChars - 3, 1))}...`;
}

function extractAnthropicText(chunk: AnthropicStreamChunk): string | null {
  const deltaText = chunk.delta?.text;
  if (typeof deltaText === "string" && deltaText.length > 0) {
    return deltaText;
  }
  const blockText = chunk.content_block?.text;
  if (typeof blockText === "string" && blockText.length > 0) {
    return blockText;
  }
  return null;
}

function makeAnthropicFallbackEvent(error: unknown): UIErrorEvent {
  const details: Record<string, unknown> = {
    provider: "anthropic",
    fallback: "openai_or_local",
  };
  let message = "Kimi Anthropic stream failed. Falling back to OpenAI/local stream.";

  if (error instanceof ProviderStreamError) {
    if (typeof error.status === "number") {
      details.status = error.status;
    }
    if (error.bodySnippet) {
      details.upstream = error.bodySnippet;
    }
    message = `${error.message} Falling back to OpenAI/local stream.`;
  } else if (error instanceof Error && error.message) {
    message = `${error.message} Falling back to OpenAI/local stream.`;
  }

  return createErrorEvent("internal_error", message, { details });
}

function countWords(content: string): number {
  const trimmed = content.trim();
  if (!trimmed) {
    return 0;
  }
  return trimmed.split(/\s+/).length;
}

function countSentences(content: string): number {
  return content
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean).length;
}

function tokenizeContent(content: string): string[] {
  const matches = content.toLowerCase().match(/[a-z][a-z0-9_-]*/g);
  if (!matches) {
    return [];
  }
  return matches.filter((token) => token.length >= 3 && !TERM_STOPWORDS.has(token));
}

function topTerms(content: string): { labels: string[]; values: number[] } {
  const frequency = new Map<string, number>();
  for (const token of tokenizeContent(content)) {
    frequency.set(token, (frequency.get(token) || 0) + 1);
  }

  const ranked = [...frequency.entries()]
    .sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }
      return a[0].localeCompare(b[0]);
    })
    .slice(0, DASHBOARD_TOP_TERMS);

  if (ranked.length === 0) {
    return {
      labels: ["pending", "terms", "from", "stream", "output"],
      values: [0, 0, 0, 0, 0],
    };
  }

  return {
    labels: ranked.map(([label]) => label),
    values: ranked.map(([, value]) => value),
  };
}

function tailSnippet(content: string, maxChars: number = 84): string {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "Waiting for first patch...";
  }
  if (normalized.length <= maxChars) {
    return normalized;
  }
  return `...${normalized.slice(-Math.max(maxChars - 3, 1))}`;
}

function createStructuredDashboardPatcher(
  send: (event: UIStreamEvent) => void,
  options: { prompt: string; granularity: UIGranularity },
): { emitInitialBlocks: () => void; onContent: ContentPatcher } {
  let lastContent = "";
  let lastChars = 0;
  let lastWords = 0;
  let tick = 0;

  const labels: string[] = ["T0"];
  const charSeries: number[] = [0];
  const deltaSeries: number[] = [0];
  const tableRows: TimelineRow[] = [{ step: "T0", snippet: "Waiting for first patch...", chars: 0 }];

  const defaultMetrics = [
    { id: "chars", label: "Chars", value: 0, delta: 0, tone: "neutral" },
    { id: "words", label: "Words", value: 0, delta: 0, tone: "neutral" },
    { id: "sentences", label: "Sentences", value: 0, delta: 0, tone: "neutral" },
    { id: "pace", label: "Chars/Step", value: 0, delta: 0, tone: "neutral" },
  ];

  const emitInitialBlocks = () => {
    send({ type: "ui.block", id: "prompt", blockType: "text", title: "Prompt", content: options.prompt, column: "full" });
    send({
      type: "ui.block",
      id: "granularity",
      blockType: "control",
      title: "Granularity",
      column: "full",
      options: ["brief", "balanced", "detailed"],
      value: options.granularity,
    });
    send({ type: "ui.block", id: "answer", blockType: "text", title: "Assistant", content: "", column: "left" });
    send({ type: "ui.block", id: "chars", blockType: "kpi", label: "Generated Chars", value: 0, column: "right" });
    send({
      type: "ui.block",
      id: "metric_compare",
      blockType: "metric-group",
      title: "Compare Metrics",
      column: "right",
      metrics: defaultMetrics,
    });
    send({
      type: "ui.block",
      id: "draft_line_chart",
      blockType: "chart",
      title: "Draft Growth",
      column: "left",
      chart: {
        type: "line",
        labels,
        series: [
          { name: "Chars", data: charSeries },
          { name: "Delta", data: deltaSeries },
        ],
      },
      chartType: "line",
      labels,
      series: [
        { name: "Chars", data: charSeries },
        { name: "Delta", data: deltaSeries },
      ],
    });
    send({
      type: "ui.block",
      id: "term_bar_chart",
      blockType: "chart",
      title: "Top Terms",
      column: "right",
      chart: {
        type: "bar",
        labels: ["pending", "terms", "from", "stream", "output"],
        series: [{ name: "Mentions", data: [0, 0, 0, 0, 0] }],
      },
      chartType: "bar",
      labels: ["pending", "terms", "from", "stream", "output"],
      series: [{ name: "Mentions", data: [0, 0, 0, 0, 0] }],
    });
    send({
      type: "ui.block",
      id: "update_table",
      blockType: "table",
      title: "Patch Timeline",
      column: "full",
      columns: [
        { key: "step", label: "Step" },
        { key: "snippet", label: "Snippet" },
        { key: "chars", label: "Chars", align: "right" },
      ],
      rows: tableRows,
    });
  };

  const onContent: ContentPatcher = (content) => {
    if (content === lastContent) {
      return;
    }

    const chars = content.length;
    const words = countWords(content);
    const sentences = countSentences(content);
    const deltaChars = Math.max(chars - lastChars, 0);
    const deltaWords = Math.max(words - lastWords, 0);
    tick += 1;

    labels.push(`T${tick}`);
    charSeries.push(chars);
    deltaSeries.push(deltaChars);
    if (labels.length > DASHBOARD_MAX_POINTS) {
      labels.shift();
      charSeries.shift();
      deltaSeries.shift();
    }

    tableRows.push({
      step: `T${tick}`,
      snippet: tailSnippet(content),
      chars,
    });
    if (tableRows.length > DASHBOARD_MAX_TABLE_ROWS) {
      tableRows.shift();
    }

    const pace = tick > 0 ? Math.round(chars / tick) : 0;
    const metrics = [
      { id: "chars", label: "Chars", value: chars, delta: deltaChars, tone: deltaChars > 0 ? "good" : "neutral" },
      { id: "words", label: "Words", value: words, delta: deltaWords, tone: deltaWords > 0 ? "good" : "neutral" },
      { id: "sentences", label: "Sentences", value: sentences, delta: 0, tone: "neutral" },
      { id: "pace", label: "Chars/Step", value: pace, delta: 0, tone: "neutral" },
    ];
    const rankedTerms = topTerms(content);
    const lineSeries = [
      { name: "Chars", data: [...charSeries] },
      { name: "Delta", data: [...deltaSeries] },
    ];
    const barSeries = [{ name: "Mentions", data: rankedTerms.values }];

    send({ type: "ui.patch", id: "answer", patch: { content } });
    send({ type: "ui.patch", id: "chars", patch: { value: chars } });
    send({ type: "ui.patch", id: "metric_compare", patch: { metrics } });
    send({
      type: "ui.patch",
      id: "draft_line_chart",
      patch: {
        chart: {
          type: "line",
          labels: [...labels],
          series: lineSeries,
        },
        chartType: "line",
        labels: [...labels],
        series: lineSeries,
      },
    });
    send({
      type: "ui.patch",
      id: "term_bar_chart",
      patch: {
        chart: {
          type: "bar",
          labels: rankedTerms.labels,
          series: barSeries,
        },
        chartType: "bar",
        labels: rankedTerms.labels,
        series: barSeries,
      },
    });
    send({ type: "ui.patch", id: "update_table", patch: { rows: [...tableRows] } });

    lastContent = content;
    lastChars = chars;
    lastWords = words;
  };

  return { emitInitialBlocks, onContent };
}

async function streamFallback(onContent: ContentPatcher, signal: AbortSignal): Promise<void> {
  const message = "Using local fallback stream because upstream providers are unavailable or failed.";
  const tokens = message.split(" ");
  let content = "";
  for (const token of tokens) {
    throwIfAborted(signal);
    content = content ? `${content} ${token}` : token;
    onContent(content);
    await sleep(70);
  }
}

async function streamFromAnthropic(
  prompt: string,
  granularity: UIGranularity,
  signal: AbortSignal,
  onContent: ContentPatcher,
): Promise<StreamResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ProviderStreamError("ANTHROPIC_API_KEY is not configured.");
  }

  const baseUrl = (process.env.ANTHROPIC_BASE_URL || ANTHROPIC_DEFAULT_BASE_URL).replace(/\/+$/, "");
  const model = process.env.ANTHROPIC_MODEL || ANTHROPIC_DEFAULT_MODEL;

  const upstream = await fetch(`${baseUrl}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      stream: true,
      temperature: 0.6,
      max_tokens: ANTHROPIC_DEFAULT_MAX_TOKENS,
      system: `You are a concise UI assistant. Return plain helpful text only. Avoid markdown tables. Response granularity is ${granularity}.`,
      messages: [{ role: "user", content: prompt }],
    }),
    signal,
  });

  if (!upstream.ok || !upstream.body) {
    let bodySnippet: string | undefined;
    try {
      bodySnippet = trimToSnippet(await upstream.text());
    } catch {
      bodySnippet = undefined;
    }
    if (!upstream.ok) {
      throw new ProviderStreamError(`Kimi Anthropic upstream returned HTTP ${upstream.status}.`, {
        status: upstream.status,
        bodySnippet,
      });
    }
    throw new ProviderStreamError("Kimi Anthropic upstream returned an empty stream body.", { bodySnippet });
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
          const parsed = JSON.parse(data) as AnthropicStreamChunk;
          if (parsed.type === "error") {
            const upstreamMessage = trimToSnippet(parsed.error?.message || "");
            throw new ProviderStreamError("Kimi Anthropic stream returned an error event.", {
              bodySnippet: upstreamMessage,
            });
          }

          const delta = extractAnthropicText(parsed);
          if (delta) {
            content += delta;
            onContent(content);
          }
        } catch (error) {
          if (error instanceof ProviderStreamError) {
            throw error;
          }
          // Ignore malformed SSE chunks from upstream.
        }
      }
      boundary = buffer.indexOf("\n\n");
    }
  }

  return {
    source: "api",
    provider: "anthropic",
  };
}

async function streamFromOpenAI(
  prompt: string,
  granularity: UIGranularity,
  signal: AbortSignal,
  onContent: ContentPatcher,
): Promise<StreamResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    await streamFallback(onContent, signal);
    return {
      source: "fallback",
      provider: "fallback",
    };
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
    await streamFallback(onContent, signal);
    return {
      source: "fallback",
      provider: "fallback",
    };
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
            onContent(content);
          }
        } catch {
          // Ignore malformed SSE chunks from upstream.
        }
      }
      boundary = buffer.indexOf("\n\n");
    }
  }

  return {
    source: "api",
    provider: "openai",
  };
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
      const sendDoneOnce = (source: UIDoneSource, provider: UIProviderBranch) => {
        if (doneSent) {
          return;
        }
        doneSent = true;
        send({ type: "ui.done", source, provider });
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

      const dashboard = createStructuredDashboardPatcher(send, { prompt, granularity });
      let streamInitialized = false;
      try {
        send({ type: "ui.init", title: "AI 回答", layout: "dashboard-2col" });
        dashboard.emitInitialBlocks();
        streamInitialized = true;
        let result: StreamResult;
        if (process.env.ANTHROPIC_API_KEY) {
          try {
            result = await streamFromAnthropic(prompt, granularity, streamAbortController.signal, dashboard.onContent);
          } catch (anthropicError) {
            if (anthropicError instanceof Error && anthropicError.message === CLIENT_ABORT_ERROR) {
              return;
            }
            send(makeAnthropicFallbackEvent(anthropicError));
            result = await streamFromOpenAI(prompt, granularity, streamAbortController.signal, dashboard.onContent);
          }
        } else {
          result = await streamFromOpenAI(prompt, granularity, streamAbortController.signal, dashboard.onContent);
        }
        sendDoneOnce(result.source, result.provider);
      } catch (error) {
        if (error instanceof Error && error.message === CLIENT_ABORT_ERROR) {
          return;
        }
        try {
          if (!streamInitialized) {
            send({ type: "ui.init", title: "AI 回答", layout: "dashboard-2col" });
            dashboard.emitInitialBlocks();
            streamInitialized = true;
          }
          await streamFallback(dashboard.onContent, streamAbortController.signal);
          sendDoneOnce("fallback", "fallback");
        } catch (fallbackError) {
          if (fallbackError instanceof Error && fallbackError.message === CLIENT_ABORT_ERROR) {
            return;
          }
          send(createErrorEvent("internal_error", "Stream failed unexpectedly."));
          sendDoneOnce("error", "fallback");
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
