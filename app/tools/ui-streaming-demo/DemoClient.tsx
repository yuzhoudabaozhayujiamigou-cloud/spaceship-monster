"use client";

import { useMemo, useRef, useState } from "react";
import { StreamBoard, type StreamBlock, type UIGranularity } from "./StreamBlocks";

type UIDoneSource = "api" | "fallback" | "error" | "cancelled";
type UIProviderBranch = "anthropic" | "openai" | "fallback" | "client" | "unknown";

type UIEvent =
  | { type: "ui.init"; title: string; layout?: string }
  | {
      type: "ui.block";
      id: string;
      blockType: "kpi" | "control" | "chart" | "text" | "table" | "metric-group";
      [k: string]: unknown;
    }
  | { type: "ui.patch"; id: string; patch: Record<string, unknown> }
  | { type: "ui.done"; source?: UIDoneSource; provider?: UIProviderBranch }
  | {
      type: "ui.error";
      code?: "invalid_input" | "rate_limited" | "internal_error";
      message: string;
      retryAfterMs?: number;
      details?: Record<string, unknown>;
    };

type Block = StreamBlock;
type StopReason = "user" | "restart";
type DoneInfo = { source: UIDoneSource | "unknown"; provider: UIProviderBranch };

const GRANULARITY_OPTIONS: UIGranularity[] = ["brief", "balanced", "detailed"];
const GRANULARITY_SET: ReadonlySet<UIGranularity> = new Set(GRANULARITY_OPTIONS);
const API_STREAM_PATH = "/api/ui-stream/";

const SAMPLE: UIEvent[] = [
  { type: "ui.init", title: "UI Streaming Local Fallback", layout: "dashboard-2col" },
  {
    type: "ui.block",
    id: "prompt",
    blockType: "text",
    title: "Prompt",
    column: "full",
    content: "Show a tiny dashboard that updates with ui.patch in real time.",
  },
  {
    type: "ui.block",
    id: "granularity",
    blockType: "control",
    title: "Granularity",
    column: "full",
    options: GRANULARITY_OPTIONS,
    value: "balanced",
  },
  { type: "ui.block", id: "answer", blockType: "text", title: "Assistant", content: "", column: "left" },
  {
    type: "ui.block",
    id: "metric_compare",
    blockType: "metric-group",
    title: "Compare Metrics",
    column: "right",
    metrics: [
      { id: "chars", label: "Chars", value: 0, delta: 0, tone: "neutral" },
      { id: "words", label: "Words", value: 0, delta: 0, tone: "neutral" },
      { id: "sentences", label: "Sentences", value: 0, delta: 0, tone: "neutral" },
      { id: "read", label: "Read Sec", value: 0, delta: 0, tone: "neutral" },
    ],
  },
  {
    type: "ui.block",
    id: "draft_line_chart",
    blockType: "chart",
    title: "Draft Growth",
    column: "left",
    chart: {
      type: "line",
      labels: ["T0"],
      series: [{ name: "Chars", data: [0] }],
    },
  },
  {
    type: "ui.block",
    id: "term_bar_chart",
    blockType: "chart",
    title: "Top Terms",
    column: "right",
    chart: {
      type: "bar",
      labels: ["stream", "patch", "chart"],
      series: [{ name: "Mentions", data: [0, 0, 0] }],
    },
  },
  {
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
    rows: [{ step: "T0", snippet: "Waiting for first patch...", chars: 0 }],
  },
  { type: "ui.block", id: "chars", blockType: "kpi", label: "Generated Chars", value: 0, column: "right" },
  {
    type: "ui.patch",
    id: "answer",
    patch: {
      content:
        "This is local fallback playback. It proves incremental rendering works even without API credentials.",
    },
  },
  { type: "ui.patch", id: "chars", patch: { value: 95 } },
  {
    type: "ui.patch",
    id: "metric_compare",
    patch: {
      metrics: [
        { id: "chars", label: "Chars", value: 95, delta: 95, tone: "good" },
        { id: "words", label: "Words", value: 14, delta: 14, tone: "good" },
        { id: "sentences", label: "Sentences", value: 2, delta: 2, tone: "neutral" },
        { id: "read", label: "Read Sec", value: 6, delta: 0, tone: "neutral" },
      ],
    },
  },
  {
    type: "ui.patch",
    id: "draft_line_chart",
    patch: {
      chart: {
        type: "line",
        labels: ["T1", "T2", "T3", "T4"],
        series: [{ name: "Chars", data: [21, 44, 73, 95] }],
      },
    },
  },
  {
    type: "ui.patch",
    id: "term_bar_chart",
    patch: {
      chart: {
        type: "bar",
        labels: ["stream", "patch", "fallback"],
        series: [{ name: "Mentions", data: [3, 2, 1] }],
      },
    },
  },
  {
    type: "ui.patch",
    id: "update_table",
    patch: {
      rows: [
        { step: "T2", snippet: "This is local fallback playback.", chars: 31 },
        { step: "T3", snippet: "It proves incremental rendering works.", chars: 67 },
        { step: "T4", snippet: "Even without API credentials.", chars: 95 },
      ],
    },
  },
  { type: "ui.done", source: "fallback", provider: "fallback" },
];

const STREAM_INACTIVITY_TIMEOUT_MS = 20_000;
const MAX_AUTO_RECONNECT_ATTEMPTS = 1;
const SESSION_ID_STORAGE_KEY = "ui-stream-demo-session-id";
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const RAW_EVENT_LOG_LIMIT = 240;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isGranularity(value: unknown): value is UIGranularity {
  return typeof value === "string" && GRANULARITY_SET.has(value as UIGranularity);
}

class StreamInactivityError extends Error {
  constructor(timeoutMs: number) {
    super(`No stream event received for ${Math.round(timeoutMs / 1000)} seconds.`);
    this.name = "StreamInactivityError";
  }
}

function createSessionId(): string {
  const generated =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

  const normalized = generated.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 64);
  return normalized || "ui_stream_demo";
}

function createRequestId(): string {
  const generated =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  return generated.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 64) || "ui_stream_req";
}

function resolveApiStreamEndpoint(): string {
  if (typeof window === "undefined") {
    return API_STREAM_PATH;
  }

  const { origin, hostname, port } = window.location;
  const isLocalDevHost = (hostname === "127.0.0.1" || hostname === "localhost") && port === "3000";
  if (isLocalDevHost) {
    const localHost = hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";
    return `http://${localHost}:3000${API_STREAM_PATH}`;
  }

  return new URL(API_STREAM_PATH, origin).toString();
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return "ui_stream_demo";
  }

  const existing = window.localStorage.getItem(SESSION_ID_STORAGE_KEY);
  if (existing && SESSION_ID_PATTERN.test(existing)) {
    return existing;
  }

  const created = createSessionId();
  window.localStorage.setItem(SESSION_ID_STORAGE_KEY, created);
  return created;
}

function clearSessionIdStorage(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(SESSION_ID_STORAGE_KEY);
}

function isRetryableStreamError(error: unknown): boolean {
  if (error instanceof StreamInactivityError) {
    return true;
  }

  if (error instanceof Error) {
    if (/Stream ended before ui\.done/i.test(error.message)) {
      return true;
    }

    if (/Failed to fetch/i.test(error.message) || /network/i.test(error.message)) {
      return true;
    }

    const statusMatch = error.message.match(/^API request failed: (\d{3})$/);
    if (statusMatch) {
      const statusCode = Number.parseInt(statusMatch[1], 10);
      return Number.isFinite(statusCode) && statusCode >= 500;
    }
  }

  return false;
}

function parseSSEFrame(frame: string): UIEvent | null {
  const lines = frame.replace(/\r/g, "").split("\n");
  const data = lines
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");
  if (!data) {
    return null;
  }
  try {
    return JSON.parse(data) as UIEvent;
  } catch {
    return null;
  }
}

export default function DemoClient() {
  const [prompt, setPrompt] = useState(
    "Explain how streaming UI patches improves perceived performance for dashboards.",
  );
  const [granularity, setGranularity] = useState<UIGranularity>("balanced");
  const [title, setTitle] = useState("Waiting for stream...");
  const [layout, setLayout] = useState("stack");
  const [blocks, setBlocks] = useState<Record<string, Block>>({});
  const [rawLog, setRawLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [error, setError] = useState<string | null>(null);
  const [autoReconnectEnabled, setAutoReconnectEnabled] = useState(true);
  const [apiEndpoint, setApiEndpoint] = useState(API_STREAM_PATH);
  const [lastDoneInfo, setLastDoneInfo] = useState<DoneInfo | null>(null);

  const runningRef = useRef(false);
  const doneSeenRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const stopRequestedRef = useRef(false);
  const stopReasonRef = useRef<StopReason | null>(null);
  const restartGranularityRef = useRef<UIGranularity | null>(null);

  function setRunningState(next: boolean) {
    runningRef.current = next;
    setRunning(next);
  }

  function appendRawLog(entry: string) {
    const line = `${new Date().toISOString()} ${entry}`;
    setRawLog((prev) => [...prev.slice(-(RAW_EVENT_LOG_LIMIT - 1)), line]);
  }

  function applyEvent(evt: UIEvent, options?: { logAsRaw?: boolean }) {
    if (options?.logAsRaw) {
      appendRawLog(`data: ${JSON.stringify(evt)}`);
    }

    if (evt.type === "ui.init") {
      setTitle(evt.title || "Dashboard");
      setLayout(evt.layout || "stack");
      return;
    }

    if (evt.type === "ui.block") {
      setBlocks((prev) => ({ ...prev, [evt.id]: evt }));
      if (evt.id === "granularity" && isGranularity(evt.value)) {
        setGranularity(evt.value);
      }
      return;
    }

    if (evt.type === "ui.patch") {
      setBlocks((prev) => ({ ...prev, [evt.id]: { ...(prev[evt.id] || {}), ...(evt.patch || {}) } }));
      if (evt.id === "granularity" && isGranularity(evt.patch?.value)) {
        setGranularity(evt.patch.value);
      }
      return;
    }

    if (evt.type === "ui.error") {
      const retryHint =
        typeof evt.retryAfterMs === "number" && evt.retryAfterMs > 0
          ? ` Retry after ~${Math.max(Math.ceil(evt.retryAfterMs / 1000), 1)}s.`
          : "";
      const codePrefix = evt.code ? `[${evt.code}] ` : "";
      setError(`${codePrefix}${evt.message}${retryHint}`);
      setStatus(evt.code ? `Stream error (${evt.code})` : "Stream error");
      return;
    }

    if (evt.type === "ui.done") {
      if (doneSeenRef.current) {
        return;
      }
      doneSeenRef.current = true;
      setDone(true);
      const source = evt.source || "unknown";
      const provider = evt.provider || "unknown";
      const doneInfo: DoneInfo = {
        source,
        provider,
      };
      setLastDoneInfo(doneInfo);
      appendRawLog(`ui.done source=${doneInfo.source} provider=${doneInfo.provider}`);
      setStatus(`Stream finished (source=${doneInfo.source}, provider=${doneInfo.provider})`);
    }
  }

  function reset(options?: { clearRawLog?: boolean }) {
    setTitle("Waiting for stream...");
    setLayout("stack");
    setBlocks({});
    setDone(false);
    setLastDoneInfo(null);
    doneSeenRef.current = false;
    setError(null);
    setStatus("Idle");
    if (options?.clearRawLog) {
      setRawLog([]);
    }
  }

  function requestStop(reason: StopReason) {
    if (!runningRef.current) {
      return;
    }
    stopRequestedRef.current = true;
    stopReasonRef.current = reason;
    setStatus(reason === "restart" ? "Switching granularity and restarting..." : "Stopping stream...");
    abortControllerRef.current?.abort();
  }

  function clearSession() {
    clearSessionIdStorage();
    setStatus("Session cleared. Next request will create a new session id.");
  }

  async function runLocalSample() {
    reset({ clearRawLog: true });
    setStatus("Playing local fallback events...");
    for (const evt of SAMPLE) {
      applyEvent(evt, { logAsRaw: true });
      await sleep(260);
    }
  }

  async function replayLocal() {
    if (runningRef.current) {
      return;
    }

    setRunningState(true);
    try {
      await runLocalSample();
    } finally {
      setRunningState(false);
    }
  }

  async function streamFromApi(requestGranularity: UIGranularity = granularity) {
    if (runningRef.current) {
      return;
    }

    reset({ clearRawLog: true });
    setGranularity(requestGranularity);
    setRunningState(true);
    stopRequestedRef.current = false;
    stopReasonRef.current = null;
    restartGranularityRef.current = null;

    const sessionId = getOrCreateSessionId();
    const endpoint = resolveApiStreamEndpoint();
    setApiEndpoint(endpoint);
    const maxAttempts = autoReconnectEnabled ? MAX_AUTO_RECONNECT_ATTEMPTS + 1 : 1;

    try {
      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const isRetry = attempt > 0;
        if (isRetry) {
          setStatus(`Stream interrupted. Reconnecting (${attempt}/${MAX_AUTO_RECONNECT_ATTEMPTS})...`);
          await sleep(350);
        } else {
          setStatus(`Connecting to ${endpoint} ...`);
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;
        let sawDone = false;
        let timedOut = false;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        const touch = () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(() => {
            timedOut = true;
            controller.abort();
          }, STREAM_INACTIVITY_TIMEOUT_MS);
        };

        try {
          touch();
          const requestUrl =
            typeof window === "undefined" ? new URL(endpoint) : new URL(endpoint, window.location.origin);
          requestUrl.searchParams.set("_ts", String(Date.now()));
          requestUrl.searchParams.set("_attempt", String(attempt));
          const requestId = createRequestId();
          appendRawLog(`POST ${requestUrl.toString()} granularity=${requestGranularity} requestId=${requestId}`);

          const response = await fetch(requestUrl, {
            method: "POST",
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
              "x-ui-session-id": sessionId,
              "x-ui-request-id": requestId,
              "Cache-Control": "no-cache, no-store, max-age=0",
              Pragma: "no-cache",
            },
            body: JSON.stringify({ prompt, granularity: requestGranularity }),
            signal: controller.signal,
          });

          appendRawLog(
            `HTTP ${response.status} redirected=${response.redirected ? "yes" : "no"} finalUrl=${response.url || "n/a"}`,
          );

          if (response.url) {
            const finalOrigin = new URL(response.url).origin;
            if (finalOrigin !== requestUrl.origin) {
              throw new Error(`Unexpected redirect origin: ${finalOrigin} (expected ${requestUrl.origin}).`);
            }
          }

          if (!response.body) {
            throw new Error(`API request failed: ${response.status}`);
          }

          if (response.ok) {
            setStatus("Streaming events from API...");
          } else {
            setStatus(`Server returned ${response.status}. Parsing ui.error stream...`);
          }
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let sawAnyEvent = false;

          while (true) {
            const { value, done: streamDone } = await reader.read();
            if (streamDone) {
              break;
            }

            if (value && value.byteLength > 0) {
              touch();
              buffer += decoder.decode(value, { stream: true });
            }

            let boundary = buffer.indexOf("\n\n");
            while (boundary !== -1) {
              const frame = buffer.slice(0, boundary);
              buffer = buffer.slice(boundary + 2);
              if (frame.trim()) {
                appendRawLog(frame);
              }
              const evt = parseSSEFrame(frame);
              if (evt) {
                sawAnyEvent = true;
                applyEvent(evt);
                touch();
                if (evt.type === "ui.done") {
                  sawDone = true;
                }
              }
              boundary = buffer.indexOf("\n\n");
            }
          }

          if (buffer.trim()) {
            appendRawLog(buffer.trim());
            const evt = parseSSEFrame(buffer);
            if (evt) {
              sawAnyEvent = true;
              applyEvent(evt);
              if (evt.type === "ui.done") {
                sawDone = true;
              }
            }
          }

          if (!sawDone) {
            if (!response.ok && !sawAnyEvent) {
              throw new Error(`API request failed: ${response.status}`);
            }
            throw new Error("Stream ended before ui.done.");
          }

          return;
        } catch (err) {
          if (stopRequestedRef.current) {
            throw err;
          }
          const errorToHandle = timedOut ? new StreamInactivityError(STREAM_INACTIVITY_TIMEOUT_MS) : err;
          const canRetry = attempt < maxAttempts - 1 && isRetryableStreamError(errorToHandle);
          if (canRetry) {
            continue;
          }
          throw errorToHandle;
        } finally {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          abortControllerRef.current = null;
        }
      }
    } catch (err) {
      if (stopRequestedRef.current) {
        if (stopReasonRef.current === "user") {
          applyEvent({ type: "ui.done", source: "cancelled", provider: "client" }, { logAsRaw: true });
          setStatus("Stream stopped by user.");
        }
      } else {
        const message = err instanceof Error ? err.message : "Unknown streaming error";
        applyEvent({ type: "ui.error", code: "internal_error", message }, { logAsRaw: true });
        applyEvent({ type: "ui.done", source: "error", provider: "fallback" }, { logAsRaw: true });
        setStatus("API stream failed.");
      }
    } finally {
      setRunningState(false);
      const shouldRestart = stopReasonRef.current === "restart" && !!restartGranularityRef.current;
      const nextGranularity = restartGranularityRef.current;
      stopRequestedRef.current = false;
      stopReasonRef.current = null;
      restartGranularityRef.current = null;
      if (shouldRestart && nextGranularity) {
        void streamFromApi(nextGranularity);
      }
    }
  }

  async function switchGranularity(next: UIGranularity) {
    if (next === granularity) {
      return;
    }

    setGranularity(next);
    setBlocks((prev) => ({
      ...prev,
      granularity: {
        id: "granularity",
        blockType: "control",
        title: "Granularity",
        options: GRANULARITY_OPTIONS,
        value: next,
      },
    }));

    appendRawLog(`client granularity -> ${next}`);
    if (runningRef.current) {
      restartGranularityRef.current = next;
      requestStop("restart");
      return;
    }
    await streamFromApi(next);
  }

  const blockList = useMemo(() => Object.values(blocks), [blocks]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
        <label htmlFor="prompt" className="mb-2 block text-sm text-zinc-300">
          Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-100 outline-none focus:border-emerald-500"
          placeholder="Describe the UI you want the stream to generate"
        />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
        <div className="mb-2 text-sm text-zinc-300">Granularity (switch triggers a new API request)</div>
        <div className="flex flex-wrap gap-2">
          {GRANULARITY_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                void switchGranularity(opt);
              }}
              className={`rounded-md px-3 py-1 text-xs ${
                opt === granularity
                  ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                  : "border border-zinc-700 bg-zinc-900 text-zinc-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              void streamFromApi();
            }}
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
          >
            {running ? "Streaming..." : "Start API Stream"}
          </button>
          <button
            onClick={() => {
              requestStop("user");
            }}
            disabled={!running}
            className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Stop
          </button>
          <button
            onClick={() => {
              void replayLocal();
            }}
            disabled={running}
            className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm text-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Local Fallback Replay
          </button>
          <button
            onClick={() => reset({ clearRawLog: false })}
            disabled={running}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset
          </button>
          <button
            onClick={clearSession}
            disabled={running}
            className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Session
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input
          type="checkbox"
          checked={autoReconnectEnabled}
          onChange={(e) => setAutoReconnectEnabled(e.target.checked)}
          disabled={running}
          className="h-4 w-4 rounded border-zinc-700 bg-zinc-900"
        />
        Auto reconnect once on interruption
      </label>

      <div className="text-sm text-zinc-400">Status: {status}</div>
      <div className="text-xs text-zinc-500">Endpoint: {apiEndpoint}</div>
      {lastDoneInfo && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
          ✓ Stream completed — Source: <span className="font-semibold">{lastDoneInfo.source}</span>, Provider: <span className="font-semibold">{lastDoneInfo.provider}</span>
        </div>
      )}
      <div className="text-xs text-zinc-500">Inactivity timeout: {Math.round(STREAM_INACTIVITY_TIMEOUT_MS / 1000)}s</div>
      {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

      <StreamBoard
        blocks={blockList}
        layout={layout}
        granularity={granularity}
        isGranularityOption={isGranularity}
        onGranularityChange={(next) => {
          void switchGranularity(next);
        }}
      />

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-zinc-300">Raw Event Log</div>
          <button
            onClick={() => setRawLog([])}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300"
          >
            Clear Log
          </button>
        </div>
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-zinc-900/70 p-3 text-xs text-zinc-300">
          {rawLog.length > 0 ? rawLog.join("\n\n") : "(empty)"}
        </pre>
      </div>

      {done && <div className="text-sm text-emerald-300">Stream finished (ui.done)</div>}
    </div>
  );
}
