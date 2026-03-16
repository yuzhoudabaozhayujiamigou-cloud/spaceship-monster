"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type UIGranularity = "brief" | "balanced" | "detailed";
export type StreamBlock = { id: string; blockType: string; [k: string]: unknown };

type ColumnName = "left" | "right" | "full";
type ChartType = "line" | "bar";
type ChartSeries = { name: string; data: number[] };
type ChartPayload = { type: ChartType; labels: string[]; series: ChartSeries[] };

type StreamBoardProps = {
  blocks: StreamBlock[];
  layout?: string;
  granularity: UIGranularity;
  onGranularityChange: (next: UIGranularity) => void;
  isGranularityOption: (value: unknown) => value is UIGranularity;
};

const CHART_COLORS = ["#38bdf8", "#22d3ee", "#a78bfa", "#f59e0b"] as const;
const PANEL_SHELL =
  "rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-xl shadow-[0_24px_80px_-40px_rgba(15,23,42,0.92)]";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => String(item));
}

function asNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => {
    const num = typeof item === "number" ? item : Number(item);
    return Number.isFinite(num) ? num : 0;
  });
}

function resolveColumn(block: StreamBlock, useTwoColumn: boolean): ColumnName {
  if (!useTwoColumn) {
    return "full";
  }

  const provided = typeof block.column === "string" ? block.column : "";
  if (provided === "left" || provided === "right" || provided === "full") {
    return provided;
  }

  if (block.blockType === "table" || block.blockType === "control") {
    return "full";
  }

  return "left";
}

function resolveChartType(raw: unknown): ChartType {
  return raw === "bar" ? "bar" : "line";
}

function resolveChartPayload(block: StreamBlock): ChartPayload {
  const nested = block.chart && typeof block.chart === "object" ? (block.chart as Record<string, unknown>) : null;
  const type = resolveChartType(nested?.type ?? block.chartType);
  const labels = asStringArray(nested?.labels ?? block.labels);
  const rawSeries = Array.isArray(nested?.series ?? block.series) ? ((nested?.series ?? block.series) as unknown[]) : [];
  const series: ChartSeries[] = rawSeries
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const row = item as Record<string, unknown>;
      return {
        name: typeof row.name === "string" ? row.name : `Series ${index + 1}`,
        data: asNumberArray(row.data),
      };
    })
    .filter((item): item is ChartSeries => item !== null);

  return { type, labels, series };
}

function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`${PANEL_SHELL}${className ? ` ${className}` : ""}`}
    >
      {children}
    </motion.section>
  );
}

function TextBlock({ block }: { block: StreamBlock }) {
  const title = String(block.title ?? "Text");
  const content = String(block.content ?? "");

  return (
    <Panel>
      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{title}</div>
      <AnimatePresence mode="wait">
        <motion.p
          key={`${block.id}-${content.length}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-100"
        >
          {content}
        </motion.p>
      </AnimatePresence>
    </Panel>
  );
}

function KpiBlock({ block }: { block: StreamBlock }) {
  const value = block.value;
  const displayValue = typeof value === "number" ? value.toLocaleString() : value === undefined ? "-" : String(value);

  return (
    <Panel>
      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{String(block.label ?? block.title ?? "KPI")}</div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${block.id}-${displayValue}`}
          initial={{ opacity: 0.35, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.2 }}
          transition={{ duration: 0.18 }}
          className="mt-2 text-3xl font-semibold text-slate-50"
        >
          {displayValue}
        </motion.div>
      </AnimatePresence>
    </Panel>
  );
}

function ControlBlock({
  block,
  granularity,
  onGranularityChange,
  isGranularityOption,
}: {
  block: StreamBlock;
  granularity: UIGranularity;
  onGranularityChange: (next: UIGranularity) => void;
  isGranularityOption: (value: unknown) => value is UIGranularity;
}) {
  const options = Array.isArray(block.options) ? block.options : [];

  return (
    <Panel>
      <div className="mb-3 text-[11px] uppercase tracking-[0.16em] text-slate-400">{String(block.title ?? "Control")}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const value = String(option);
          const isActive = value === String(block.value ?? granularity) || value === granularity;
          const canUse = isGranularityOption(value);
          return (
            <motion.button
              key={value}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.14 }}
              onClick={() => {
                if (canUse) {
                  onGranularityChange(value);
                }
              }}
              disabled={!canUse}
              className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                isActive
                  ? "border-cyan-400/45 bg-cyan-400/10 text-cyan-200 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-slate-100"
              } disabled:cursor-not-allowed disabled:opacity-45`}
            >
              {value}
            </motion.button>
          );
        })}
      </div>
    </Panel>
  );
}

function MetricGroupBlock({ block }: { block: StreamBlock }) {
  const metrics = Array.isArray(block.metrics) ? block.metrics : [];

  return (
    <Panel>
      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{String(block.title ?? "Compare Metrics")}</div>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.length === 0 ? (
          <div className="col-span-2 rounded-xl border border-slate-700/70 bg-slate-950/50 p-6 text-center text-slate-400 lg:col-span-4">
            No metrics available.
          </div>
        ) : (
          metrics.map((metric, idx) => {
            const row = metric && typeof metric === "object" ? (metric as Record<string, unknown>) : {};
            const label = String(row.label ?? row.id ?? `Metric ${idx + 1}`);
            const rawValue = row.value;
            const value =
              typeof rawValue === "number"
                ? rawValue.toLocaleString()
                : rawValue === undefined || rawValue === null
                  ? "-"
                  : String(rawValue);
            const rawDelta = row.delta;
            const deltaNumber = typeof rawDelta === "number" ? rawDelta : Number.NaN;
            const hasDelta = Number.isFinite(deltaNumber);
            const tone = typeof row.tone === "string" ? row.tone : "neutral";
            const deltaClass =
              tone === "good"
                ? "text-emerald-300"
                : tone === "warn"
                  ? "text-amber-300"
                  : tone === "bad"
                    ? "text-rose-300"
                    : "text-slate-400";
            const deltaIcon = hasDelta && deltaNumber > 0 ? "↑" : hasDelta && deltaNumber < 0 ? "↓" : "";

            return (
              <motion.article
                key={`${label}_${idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.02 }}
                className="rounded-xl border border-slate-700/80 bg-slate-950/55 p-3"
              >
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{label}</div>
                <div className="mt-2 text-2xl font-semibold text-slate-50">{value}</div>
                <div className={`mt-1 text-xs ${deltaClass}`}>
                  {hasDelta ? `${deltaIcon} ${deltaNumber >= 0 ? "+" : ""}${Math.round(deltaNumber)}` : "—"}
                </div>
              </motion.article>
            );
          })
        )}
      </div>
    </Panel>
  );
}

function LineChart({ payload }: { payload: ChartPayload }) {
  const series = payload.series.filter((item) => item.data.length > 0);
  const allValues = series.flatMap((item) => item.data);
  const max = allValues.length > 0 ? Math.max(...allValues) : 1;
  const min = allValues.length > 0 ? Math.min(...allValues) : 0;
  const span = max - min || 1;

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-700/80 bg-slate-950/55 p-3">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-48 w-full">
          <defs>
            <linearGradient id="chartGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <line x1="0" y1="95" x2="100" y2="95" stroke="#334155" strokeWidth="0.6" />
          {series.map((item, seriesIndex) => {
            const points = item.data
              .map((value, idx) => {
                const total = Math.max(item.data.length - 1, 1);
                const x = (idx / total) * 100;
                const y = 92 - ((value - min) / span) * 82;
                return `${x},${y}`;
              })
              .join(" ");
            return (
              <motion.polyline
                key={`${item.name}_${seriesIndex}`}
                fill="none"
                stroke={seriesIndex === 0 ? "url(#chartGlow)" : CHART_COLORS[seriesIndex % CHART_COLORS.length]}
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                initial={{ pathLength: 0, opacity: 0.4 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="grid flex-1 grid-cols-3 gap-2 text-[11px] text-slate-300 md:grid-cols-6">
          {payload.labels.slice(-6).map((label, idx) => (
            <div key={`${label}_${idx}`} className="truncate">
              {label}
            </div>
          ))}
        </div>
        {series.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {series.map((item, idx) => (
              <div key={`legend_${idx}`} className="flex items-center gap-1.5 text-[11px] text-slate-200">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: CHART_COLORS[idx % CHART_COLORS.length] }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BarChart({ payload }: { payload: ChartPayload }) {
  const labels = payload.labels;
  const firstSeries = payload.series[0];
  const values = firstSeries ? firstSeries.data : [];
  const max = Math.max(...values, 1);

  return (
    <div className="space-y-3">
      {labels.map((label, idx) => {
        const value = values[idx] ?? 0;
        const width = Math.max((value / max) * 100, value > 0 ? 4 : 0);
        return (
          <div key={`${label}_${idx}`} className="grid grid-cols-[90px_1fr_54px] items-center gap-3 text-xs">
            <span className="truncate text-slate-300" title={label}>
              {label}
            </span>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800/90">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400"
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
            <span className="text-right font-mono text-slate-100">{value.toLocaleString()}</span>
          </div>
        );
      })}
    </div>
  );
}

function ChartBlock({ block }: { block: StreamBlock }) {
  const payload = resolveChartPayload(block);
  const hasData = payload.series.length > 0 && payload.series.some((entry) => entry.data.length > 0);

  return (
    <Panel>
      <div className="mb-4 text-[11px] uppercase tracking-[0.16em] text-slate-400">{String(block.title ?? "Chart")}</div>
      {!hasData ? (
        <div className="flex h-44 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-950/55 text-slate-400">
          No chart data available.
        </div>
      ) : payload.type === "bar" ? (
        <BarChart payload={payload} />
      ) : (
        <LineChart payload={payload} />
      )}
    </Panel>
  );
}

function TableBlock({ block }: { block: StreamBlock }) {
  const rawColumns = Array.isArray(block.columns) ? block.columns : [];
  const columns = rawColumns
    .map((column, idx) => {
      if (typeof column === "string") {
        return { key: column, label: column, align: "left" as const };
      }
      if (!column || typeof column !== "object") {
        return null;
      }

      const row = column as Record<string, unknown>;
      const key = String(row.key ?? `col_${idx}`);
      const label = String(row.label ?? key);
      const align = row.align === "right" ? "right" : "left";
      return { key, label, align };
    })
    .filter((item): item is { key: string; label: string; align: "left" | "right" } => item !== null);
  const rows = Array.isArray(block.rows) ? block.rows : [];

  return (
    <Panel>
      <div className="mb-3 text-[11px] uppercase tracking-[0.16em] text-slate-400">{String(block.title ?? "Table")}</div>
      <div className="overflow-x-auto rounded-xl border border-slate-700/80 bg-slate-950/60">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/65 text-slate-300">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-[11px] uppercase tracking-[0.16em] ${column.align === "right" ? "text-right" : "text-left"}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/90 text-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={Math.max(columns.length, 1)} className="px-4 py-6 text-center text-slate-400">
                  No data available.
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => {
                const item = row && typeof row === "object" ? (row as Record<string, unknown>) : {};
                return (
                  <tr key={`row_${rowIndex}`} className="transition hover:bg-slate-900/70">
                    {columns.map((column) => {
                      const value = item[column.key];
                      const text =
                        typeof value === "number" ? value.toLocaleString() : value === undefined ? "-" : String(value);
                      return (
                        <td
                          key={`${rowIndex}_${column.key}`}
                          className={`px-4 py-3 ${column.align === "right" ? "text-right font-mono" : "text-left"}`}
                        >
                          {text}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function UnknownBlock({ block }: { block: StreamBlock }) {
  return (
    <Panel className="p-3">
      <pre className="overflow-auto text-xs text-slate-300">{JSON.stringify(block, null, 2)}</pre>
    </Panel>
  );
}

function RenderBlock({
  block,
  granularity,
  onGranularityChange,
  isGranularityOption,
}: {
  block: StreamBlock;
  granularity: UIGranularity;
  onGranularityChange: (next: UIGranularity) => void;
  isGranularityOption: (value: unknown) => value is UIGranularity;
}) {
  if (block.blockType === "text") {
    return <TextBlock block={block} />;
  }
  if (block.blockType === "kpi") {
    return <KpiBlock block={block} />;
  }
  if (block.blockType === "control") {
    return (
      <ControlBlock
        block={block}
        granularity={granularity}
        onGranularityChange={onGranularityChange}
        isGranularityOption={isGranularityOption}
      />
    );
  }
  if (block.blockType === "metric-group") {
    return <MetricGroupBlock block={block} />;
  }
  if (block.blockType === "table") {
    return <TableBlock block={block} />;
  }
  if (block.blockType === "chart") {
    return <ChartBlock block={block} />;
  }
  return <UnknownBlock block={block} />;
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${PANEL_SHELL} flex min-h-28 items-center justify-center text-sm text-slate-400`}
    >
      No blocks to display yet. Start stream to see structured updates.
    </motion.div>
  );
}

export function StreamBoard({
  blocks,
  layout,
  granularity,
  onGranularityChange,
  isGranularityOption,
}: StreamBoardProps) {
  const useTwoColumn = typeof layout === "string" && /(2col|dashboard)/i.test(layout);

  if (!useTwoColumn) {
    return (
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <EmptyState />
        ) : (
          <AnimatePresence mode="popLayout">
            {blocks.map((block) => (
              <motion.div
                layout
                key={block.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
              >
                <RenderBlock
                  block={block}
                  granularity={granularity}
                  onGranularityChange={onGranularityChange}
                  isGranularityOption={isGranularityOption}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {blocks.length === 0 ? (
        <div className="lg:col-span-2">
          <EmptyState />
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {blocks.map((block) => {
            const column = resolveColumn(block, true);
            const className = column === "full" ? "lg:col-span-2" : "";
            return (
              <motion.div
                layout
                key={block.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className={className}
              >
                <RenderBlock
                  block={block}
                  granularity={granularity}
                  onGranularityChange={onGranularityChange}
                  isGranularityOption={isGranularityOption}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}
