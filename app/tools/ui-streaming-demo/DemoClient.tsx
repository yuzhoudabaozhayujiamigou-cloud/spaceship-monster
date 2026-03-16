"use client";

import { AnimatePresence, motion } from "framer-motion";
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
type VizPoint = { id: number; label: string; chars: number; deltaChars: number; cps: number };
type ActionTone = "primary" | "neutral" | "danger" | "info" | "warning";

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
const VISUAL_WINDOW_SIZE = 24;
const VISUAL_GOAL_CHARS = 900;

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

function buildWavePath(points: VizPoint[]): string {
  if (points.length === 0) {
    return "M0,90 L100,90";
  }

  const maxSpeed = Math.max(...points.map((point) => point.cps), 1);
  return points
    .map((point, idx) => {
      const x = points.length === 1 ? 100 : (idx / Math.max(points.length - 1, 1)) * 100;
      const normalized = point.cps / maxSpeed;
      const y = 92 - normalized * 74;
      return `${idx === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

function toneClasses(tone: ActionTone): string {
  if (tone === "primary") {
    return "border-cyan-400/45 bg-cyan-400/12 text-cyan-200 hover:border-cyan-300/65";
  }
  if (tone === "danger") {
    return "border-rose-400/35 bg-rose-400/10 text-rose-200 hover:border-rose-300/55";
  }
  if (tone === "info") {
    return "border-sky-400/35 bg-sky-400/10 text-sky-200 hover:border-sky-300/55";
  }
  if (tone === "warning") {
    return "border-amber-400/35 bg-amber-400/10 text-amber-200 hover:border-amber-300/55";
  }
  return "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500";
}

function ActionButton({
  label,
  onClick,
  disabled,
  tone = "neutral",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: ActionTone;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.14 }}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${toneClasses(tone)} disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {label}
    </motion.button>
  );
}

function StreamingVisualizer({
  points,
  running,
  totalChars,
}: {
  points: VizPoint[];
  running: boolean;
  totalChars: number;
}) {
  const bars = points.slice(-16);
  const maxDelta = Math.max(...bars.map((point) => point.deltaChars), 1);
  const completion = Math.min((totalChars / VISUAL_GOAL_CHARS) * 100, 100);
  const avgSpeed = bars.length > 0 ? bars.reduce((acc, point) => acc + point.cps, 0) / bars.length : 0;

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm uppercase tracking-[0.18em] text-slate-300">UI Streaming Visual Demo</h3>
          <p className="mt-1 text-xs text-slate-400">Realtime signal for character throughput and completion.</p>
        </div>
        <div className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-[11px] text-slate-300">
          {running ? "LIVE" : "IDLE"}
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-3">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>Character Speed Wave</span>
            <span>{avgSpeed.toFixed(1)} chars/sec avg</span>
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-36 w-full">
            <defs>
              <linearGradient id="demoWaveStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
            <line x1="0" y1="90" x2="100" y2="90" stroke="#334155" strokeWidth="0.7" />
            <motion.path
              d={buildWavePath(points)}
              fill="none"
              stroke="url(#demoWaveStroke)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0.2, opacity: 0.7 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          </svg>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-3">
          <div className="mb-2 text-xs text-slate-400">Burst Histogram (delta chars / event)</div>
          <div className="flex h-36 items-end gap-1.5">
            {bars.length === 0 ? (
              <div className="w-full rounded-lg border border-dashed border-slate-700 py-5 text-center text-xs text-slate-500">
                Waiting for stream events...
              </div>
            ) : (
              bars.map((point) => {
                const barHeight = Math.max((point.deltaChars / maxDelta) * 100, point.deltaChars > 0 ? 8 : 2);
                return (
                  <motion.div
                    key={point.id}
                    layout
                    initial={{ height: 0, opacity: 0.4 }}
                    animate={{ height: `${barHeight}%`, opacity: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan-500/75 to-sky-300/80"
                    title={`${point.deltaChars} chars @ ${point.label}`}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Stream completeness</span>
          <span>{Math.round(completion)}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-800">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400"
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.section>
  );
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
  const [vizPoints, setVizPoints] = useState<VizPoint[]>([]);

  const runningRef = useRef(false);
  const doneSeenRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const stopRequestedRef = useRef(false);
  const stopReasonRef = useRef<StopReason | null>(null);
  const restartGranularityRef = useRef<UIGranularity | null>(null);
  const vizRef = useRef<{ chars: number; at: number }>({ chars: 0, at: Date.now() });

  function setRunningState(next: boolean) {
    runningRef.current = next;
    setRunning(next);
  }

  function appendRawLog(entry: string) {
    const line = `${new Date().toISOString()} ${entry}`;
    setRawLog((prev) => [...prev.slice(-(RAW_EVENT_LOG_LIMIT - 1)), line]);
  }

  function pushVizPoint(chars: number) {
    const now = Date.now();
    const prev = vizRef.current;
    const safeChars = Math.max(chars, 0);

    if (safeChars === prev.chars && vizPoints.length > 0) {
      return;
    }

    const deltaChars = Math.max(safeChars - prev.chars, 0);
    const deltaMs = Math.max(now - prev.at, 1);
    const cps = deltaChars / (deltaMs / 1000);
    const label = new Date(now).toISOString().slice(14, 19);

    vizRef.current = { chars: safeChars, at: now };
    setVizPoints((previous) => [
      ...previous.slice(-(VISUAL_WINDOW_SIZE - 1)),
      { id: now, label, chars: safeChars, deltaChars, cps },
    ]);
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
      if (evt.id === "chars" && typeof evt.value === "number") {
        pushVizPoint(evt.value);
      }
      return;
    }

    if (evt.type === "ui.patch") {
      setBlocks((prev) => ({ ...prev, [evt.id]: { ...(prev[evt.id] || {}), ...(evt.patch || {}) } }));
      if (evt.id === "granularity" && isGranularity(evt.patch?.value)) {
        setGranularity(evt.patch.value);
      }
      if (evt.id === "chars" && typeof evt.patch?.value === "number") {
        pushVizPoint(evt.patch.value);
      }
      if (evt.id === "answer" && typeof evt.patch?.content === "string") {
        pushVizPoint(evt.patch.content.length);
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
    setVizPoints([]);
    vizRef.current = { chars: 0, at: Date.now() };
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
  const generatedChars = useMemo(() => {
    const charsBlock = blocks.chars;
    const fromKpi = typeof charsBlock?.value === "number" ? charsBlock.value : 0;
    const answerBlock = blocks.answer;
    const fromAnswer = typeof answerBlock?.content === "string" ? answerBlock.content.length : 0;
    return Math.max(fromKpi, fromAnswer);
  }, [blocks]);

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-slate-800 bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute -top-24 left-1/3 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Streaming Workbench</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            Live SSE orchestration with structured blocks, animated transitions, and throughput visual telemetry.
          </p>
        </motion.div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <motion.aside
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22, delay: 0.04 }}
            className="space-y-4"
          >
            <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-xl">
              <label htmlFor="prompt" className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">
                Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 p-3 text-sm text-slate-50 outline-none transition focus:border-cyan-400/60"
                placeholder="Describe the UI you want the stream to generate"
              />
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-xl">
              <div className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-400">Granularity</div>
              <div className="flex flex-wrap gap-2">
                {GRANULARITY_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.14 }}
                    onClick={() => {
                      void switchGranularity(opt);
                    }}
                    className={`rounded-xl border px-3 py-2 text-xs transition ${
                      opt === granularity
                        ? "border-cyan-400/50 bg-cyan-400/12 text-cyan-200"
                        : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-xl">
              <div className="mb-3 text-xs uppercase tracking-[0.16em] text-slate-400">Controls</div>
              <div className="grid grid-cols-2 gap-2">
                <ActionButton
                  label={running ? "Streaming..." : "Start API Stream"}
                  onClick={() => {
                    void streamFromApi();
                  }}
                  tone="primary"
                  disabled={running}
                />
                <ActionButton label="Stop" onClick={() => requestStop("user")} disabled={!running} tone="danger" />
                <ActionButton
                  label="Fallback Replay"
                  onClick={() => {
                    void replayLocal();
                  }}
                  disabled={running}
                  tone="info"
                />
                <ActionButton
                  label="Reset"
                  onClick={() => reset({ clearRawLog: false })}
                  disabled={running}
                  tone="neutral"
                />
                <ActionButton label="Clear Session" onClick={clearSession} disabled={running} tone="warning" />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-xl">
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={autoReconnectEnabled}
                  onChange={(e) => setAutoReconnectEnabled(e.target.checked)}
                  disabled={running}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900"
                />
                Auto reconnect once on interruption
              </label>
              <div className="mt-3 space-y-1 text-xs text-slate-400">
                <div>Status: {status}</div>
                <div>Endpoint: {apiEndpoint}</div>
                <div>Inactivity timeout: {Math.round(STREAM_INACTIVITY_TIMEOUT_MS / 1000)}s</div>
              </div>
            </section>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.24, delay: 0.06 }}
            className="space-y-4 lg:border-l lg:border-slate-800 lg:pl-6"
          >
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="stream-error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="rounded-2xl border border-rose-400/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                >
                  {error}
                </motion.div>
              ) : lastDoneInfo ? (
                <motion.div
                  key="stream-done"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="rounded-2xl border border-emerald-400/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
                >
                  Stream completed with source <span className="font-semibold">{lastDoneInfo.source}</span> and
                  provider <span className="font-semibold">{lastDoneInfo.provider}</span>.
                </motion.div>
              ) : (
                <motion.div
                  key="stream-status"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-300"
                >
                  Ready for stream execution.
                </motion.div>
              )}
            </AnimatePresence>

            <StreamingVisualizer points={vizPoints} running={running} totalChars={generatedChars} />

            <StreamBoard
              blocks={blockList}
              layout={layout}
              granularity={granularity}
              isGranularityOption={isGranularity}
              onGranularityChange={(next) => {
                void switchGranularity(next);
              }}
            />

            <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Raw Event Log</div>
                <ActionButton label="Clear Log" onClick={() => setRawLog([])} tone="neutral" />
              </div>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-300">
                {rawLog.length > 0 ? rawLog.join("\n\n") : "(empty)"}
              </pre>
            </section>

            {done && <div className="text-sm text-emerald-300">Stream finished (ui.done)</div>}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
