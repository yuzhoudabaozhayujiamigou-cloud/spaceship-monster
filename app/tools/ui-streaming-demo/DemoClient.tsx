"use client";

import { useMemo, useRef, useState } from "react";

type UIDoneSource = "api" | "fallback" | "error" | "cancelled";
type UIGranularity = "brief" | "balanced" | "detailed";

type UIEvent =
  | { type: "ui.init"; title: string; layout?: string }
  | { type: "ui.block"; id: string; blockType: "kpi" | "control" | "chart" | "text"; [k: string]: unknown }
  | { type: "ui.patch"; id: string; patch: Record<string, unknown> }
  | { type: "ui.done"; source?: UIDoneSource }
  | {
      type: "ui.error";
      code?: "invalid_input" | "rate_limited" | "internal_error";
      message: string;
      retryAfterMs?: number;
      details?: Record<string, unknown>;
    };

type Block = { id: string; blockType: string; [k: string]: unknown };
type StopReason = "user" | "restart";

const GRANULARITY_OPTIONS: UIGranularity[] = ["brief", "balanced", "detailed"];
const GRANULARITY_SET: ReadonlySet<UIGranularity> = new Set(GRANULARITY_OPTIONS);

const SAMPLE: UIEvent[] = [
  { type: "ui.init", title: "UI Streaming Local Fallback", layout: "stack" },
  {
    type: "ui.block",
    id: "prompt",
    blockType: "text",
    title: "Prompt",
    content: "Show a tiny dashboard that updates with ui.patch in real time.",
  },
  {
    type: "ui.block",
    id: "granularity",
    blockType: "control",
    title: "Granularity",
    options: GRANULARITY_OPTIONS,
    value: "balanced",
  },
  { type: "ui.block", id: "answer", blockType: "text", title: "Assistant", content: "" },
  { type: "ui.block", id: "chars", blockType: "kpi", label: "Generated Chars", value: 0 },
  {
    type: "ui.patch",
    id: "answer",
    patch: {
      content:
        "This is local fallback playback. It proves incremental rendering works even without API credentials.",
    },
  },
  { type: "ui.patch", id: "chars", patch: { value: 95 } },
  { type: "ui.done", source: "fallback" },
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
  const [blocks, setBlocks] = useState<Record<string, Block>>({});
  const [rawLog, setRawLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [error, setError] = useState<string | null>(null);
  const [autoReconnectEnabled, setAutoReconnectEnabled] = useState(true);

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
      setStatus(`Stream finished (${evt.source || "unknown"})`);
    }
  }

  function reset(options?: { clearRawLog?: boolean }) {
    setTitle("Waiting for stream...");
    setBlocks({});
    setDone(false);
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
    const maxAttempts = autoReconnectEnabled ? MAX_AUTO_RECONNECT_ATTEMPTS + 1 : 1;

    try {
      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const isRetry = attempt > 0;
        if (isRetry) {
          setStatus(`Stream interrupted. Reconnecting (${attempt}/${MAX_AUTO_RECONNECT_ATTEMPTS})...`);
          await sleep(350);
        } else {
          setStatus("Connecting to /api/ui-stream/ ...");
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
          appendRawLog(`POST /api/ui-stream granularity=${requestGranularity}`);

          const response = await fetch("/api/ui-stream/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-ui-session-id": sessionId,
            },
            body: JSON.stringify({ prompt, granularity: requestGranularity }),
            signal: controller.signal,
          });

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
          applyEvent({ type: "ui.done", source: "cancelled" }, { logAsRaw: true });
          setStatus("Stream stopped by user.");
        }
      } else {
        const message = err instanceof Error ? err.message : "Unknown streaming error";
        applyEvent({ type: "ui.error", code: "internal_error", message }, { logAsRaw: true });
        applyEvent({ type: "ui.done", source: "error" }, { logAsRaw: true });
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
      <div className="text-xs text-zinc-500">Inactivity timeout: {Math.round(STREAM_INACTIVITY_TIMEOUT_MS / 1000)}s</div>
      {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

      {blockList.map((b) => {
        if (b.blockType === "text") {
          return (
            <div key={b.id} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="text-sm text-zinc-400">{String(b.title ?? "")}</div>
              <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-100">{String(b.content ?? "")}</div>
            </div>
          );
        }

        if (b.blockType === "kpi") {
          const value = b.value;
          const displayValue =
            typeof value === "number" ? value.toLocaleString() : value === undefined ? "-" : String(value);
          return (
            <div key={b.id} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="text-sm text-zinc-400">{String(b.label ?? "")}</div>
              <div className="mt-1 text-2xl font-mono">{displayValue}</div>
            </div>
          );
        }

        if (b.blockType === "control") {
          return (
            <div key={b.id} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="mb-2 text-sm text-zinc-400">Granularity</div>
              <div className="flex gap-2">
                {(Array.isArray(b.options) ? (b.options as string[]) : []).map((opt: string) => {
                  const isActive = opt === b.value || opt === granularity;
                  const canUse = isGranularity(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        if (canUse) {
                          void switchGranularity(opt);
                        }
                      }}
                      disabled={!canUse}
                      className={`rounded-md px-3 py-1 text-xs ${
                        isActive
                          ? "border border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                          : "border border-zinc-700 bg-zinc-800 text-zinc-300"
                      } disabled:cursor-not-allowed disabled:opacity-40`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        if (b.blockType === "chart") {
          const firstSeries =
            Array.isArray(b.series) && b.series.length > 0 && typeof b.series[0] === "object" && b.series[0] !== null
              ? (b.series[0] as { data?: unknown })
              : undefined;
          const data = Array.isArray(firstSeries?.data) ? (firstSeries.data as number[]) : [];
          const max = Math.max(...data, 1);
          return (
            <div key={b.id} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="mb-3 text-sm text-zinc-400">{String(b.title ?? "")}</div>
              <div className="space-y-2">
                {(Array.isArray(b.labels) ? (b.labels as string[]) : []).map((label: string, idx: number) => (
                  <div key={label} className="grid grid-cols-[56px_1fr_120px] items-center gap-2 text-xs">
                    <span className="text-zinc-400">{label}</span>
                    <div className="h-2 rounded bg-zinc-800">
                      <div
                        className="h-2 rounded bg-emerald-400"
                        style={{ width: `${Math.max((data[idx] / max) * 100, 2)}%` }}
                      />
                    </div>
                    <span className="font-mono text-zinc-200">{Number(data[idx] || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return (
          <pre key={b.id} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-xs text-zinc-300">
            {JSON.stringify(b, null, 2)}
          </pre>
        );
      })}

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
