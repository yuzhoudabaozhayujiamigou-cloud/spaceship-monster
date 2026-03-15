"use client";

import { useMemo, useState } from "react";

type UIEvent =
  | { type: "ui.init"; title: string; layout?: string }
  | { type: "ui.block"; id: string; blockType: "kpi" | "control" | "chart"; [k: string]: unknown }
  | { type: "ui.patch"; id: string; patch: Record<string, unknown> }
  | { type: "ui.done" };

type Block = { id: string; blockType: string; [k: string]: unknown };

const SAMPLE: UIEvent[] = [
  { type: "ui.init", title: "Token Usage Dashboard", layout: "stack" },
  { type: "ui.block", id: "kpi-1", blockType: "kpi", label: "Today Total Tokens", value: 44337020 },
  {
    type: "ui.block",
    id: "control-1",
    blockType: "control",
    controlType: "segmented",
    key: "granularity",
    options: ["day", "week", "month"],
    value: "day",
  },
  {
    type: "ui.block",
    id: "chart-1",
    blockType: "chart",
    chartType: "line",
    title: "Daily Tokens (7d)",
    labels: ["03-09", "03-10", "03-11", "03-12", "03-13", "03-14", "03-15"],
    series: [{ name: "total_tokens", data: [42112221, 43888212, 52011212, 51100220, 48888211, 46333111, 44337020] }],
  },
  { type: "ui.done" },
];

export default function DemoClient() {
  const [title, setTitle] = useState("Waiting for stream...");
  const [blocks, setBlocks] = useState<Record<string, Block>>({});
  const [done, setDone] = useState(false);
  const [running, setRunning] = useState(false);

  function applyEvent(evt: UIEvent) {
    if (evt.type === "ui.init") {
      setTitle(evt.title || "Dashboard");
      return;
    }
    if (evt.type === "ui.block") {
      setBlocks((prev) => ({ ...prev, [evt.id]: evt }));
      return;
    }
    if (evt.type === "ui.patch") {
      setBlocks((prev) => ({ ...prev, [evt.id]: { ...(prev[evt.id] || {}), ...(evt.patch || {}) } }));
      return;
    }
    if (evt.type === "ui.done") setDone(true);
  }

  function reset() {
    setTitle("Waiting for stream...");
    setBlocks({});
    setDone(false);
  }

  function replay() {
    if (running) return;
    reset();
    setRunning(true);
    let i = 0;
    const timer = setInterval(() => {
      applyEvent(SAMPLE[i]);
      i += 1;
      if (i >= SAMPLE.length) {
        clearInterval(timer);
        setRunning(false);
      }
    }, 450);
  }

  const blockList = useMemo(() => Object.values(blocks), [blocks]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={replay}
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
          >
            {running ? "Streaming..." : "Replay Stream"}
          </button>
          <button
            onClick={reset}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
          >
            Reset
          </button>
        </div>
      </div>

      {blockList.map((b) => {
        if (b.blockType === "kpi") {
          return (
            <div key={b.id} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="text-sm text-zinc-400">{String(b.label ?? "")}</div>
              <div className="mt-1 text-2xl font-mono">{Number((b.value as number) ?? 0).toLocaleString()}</div>
            </div>
          );
        }

        if (b.blockType === "control") {
          return (
            <div key={b.id} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="mb-2 text-sm text-zinc-400">Granularity</div>
              <div className="flex gap-2">
                {(Array.isArray(b.options) ? (b.options as string[]) : []).map((opt: string) => (
                  <span
                    key={opt}
                    className={`rounded-md px-3 py-1 text-xs ${
                      opt === b.value ? "bg-emerald-500/20 text-emerald-300" : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          );
        }

        if (b.blockType === "chart") {
          const firstSeries = Array.isArray(b.series) && b.series.length > 0 && typeof b.series[0] === "object" && b.series[0] !== null ? (b.series[0] as { data?: unknown }) : undefined;
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

      {done && <div className="text-sm text-emerald-300">Stream finished (ui.done)</div>}
    </div>
  );
}
