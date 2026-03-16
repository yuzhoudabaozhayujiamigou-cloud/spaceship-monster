"use client";

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

const CHART_COLORS = ["#34d399", "#60a5fa", "#f59e0b", "#f472b6"] as const;

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

function TextBlock({ block }: { block: StreamBlock }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="text-sm text-zinc-400">{String(block.title ?? "Text")}</div>
      <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-100">{String(block.content ?? "")}</div>
    </div>
  );
}

function KpiBlock({ block }: { block: StreamBlock }) {
  const value = block.value;
  const displayValue = typeof value === "number" ? value.toLocaleString() : value === undefined ? "-" : String(value);
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="text-sm text-zinc-400">{String(block.label ?? block.title ?? "KPI")}</div>
      <div className="mt-1 text-2xl font-mono text-zinc-100">{displayValue}</div>
    </div>
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
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="mb-2 text-sm text-zinc-400">{String(block.title ?? "Control")}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const value = String(option);
          const isActive = value === String(block.value ?? granularity) || value === granularity;
          const canUse = isGranularityOption(value);
          return (
            <button
              key={value}
              onClick={() => {
                if (canUse) {
                  onGranularityChange(value);
                }
              }}
              disabled={!canUse}
              className={`rounded-md px-3 py-1 text-xs ${
                isActive
                  ? "border border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                  : "border border-zinc-700 bg-zinc-800 text-zinc-300"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MetricGroupBlock({ block }: { block: StreamBlock }) {
  const metrics = Array.isArray(block.metrics) ? block.metrics : [];
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="text-sm text-zinc-400">{String(block.title ?? "Compare Metrics")}</div>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.length === 0 ? (
          <div className="col-span-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-center text-zinc-500 lg:col-span-4">
            No metrics available
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
                    : "text-zinc-400";
            const deltaIcon = hasDelta && deltaNumber > 0 ? "↑" : hasDelta && deltaNumber < 0 ? "↓" : "";
            return (
              <div key={`${label}_${idx}`} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 transition-all hover:border-zinc-700">
                <div className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</div>
                <div className="mt-1 text-xl font-semibold text-zinc-100">{value}</div>
                <div className={`mt-1 text-xs font-medium ${deltaClass}`}>
                  {hasDelta ? `${deltaIcon} ${deltaNumber >= 0 ? "+" : ""}${Math.round(deltaNumber)}` : "—"}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
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
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-44 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
        <line x1="0" y1="95" x2="100" y2="95" stroke="#3f3f46" strokeWidth="0.7" />
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
            <polyline
              key={`${item.name}_${seriesIndex}`}
              fill="none"
              stroke={CHART_COLORS[seriesIndex % CHART_COLORS.length]}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          );
        })}
      </svg>
      <div className="flex items-center justify-between">
        <div className="grid flex-1 grid-cols-3 gap-2 text-[11px] text-zinc-500 md:grid-cols-6">
          {payload.labels.slice(-6).map((label, idx) => (
            <div key={`${label}_${idx}`} className="truncate">
              {label}
            </div>
          ))}
        </div>
        {series.length > 0 && (
          <div className="ml-3 flex flex-wrap gap-2">
            {series.map((item, idx) => (
              <div key={`legend_${idx}`} className="flex items-center gap-1 text-[10px] text-zinc-400">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
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
    <div className="space-y-2">
      {labels.map((label, idx) => {
        const value = values[idx] ?? 0;
        const width = Math.max((value / max) * 100, value > 0 ? 4 : 0);
        return (
          <div key={`${label}_${idx}`} className="grid grid-cols-[96px_1fr_56px] items-center gap-2 text-xs">
            <span className="truncate text-zinc-400" title={label}>{label}</span>
            <div className="h-3 rounded-full bg-zinc-800">
              <div className="h-3 rounded-full bg-sky-400 transition-all duration-300" style={{ width: `${width}%` }} />
            </div>
            <span className="text-right font-mono text-zinc-300">{value.toLocaleString()}</span>
          </div>
        );
      })}
    </div>
  );
}

function ChartBlock({ block }: { block: StreamBlock }) {
  const payload = resolveChartPayload(block);
  const hasData = payload.series.length > 0 && payload.series.some(s => s.data.length > 0);
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="mb-3 text-sm text-zinc-400">{String(block.title ?? "Chart")}</div>
      {!hasData ? (
        <div className="flex h-44 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-500">
          No chart data available
        </div>
      ) : (
        payload.type === "bar" ? <BarChart payload={payload} /> : <LineChart payload={payload} />
      )}
    </div>
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
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="mb-3 text-sm text-zinc-400">{String(block.title ?? "Table")}</div>
      <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900/50">
        <table className="min-w-full divide-y divide-zinc-800 text-sm">
          <thead className="bg-zinc-950/60 text-zinc-300">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide ${column.align === "right" ? "text-right" : "text-left"}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-200">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-4 text-center text-zinc-500">
                  No data available
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => {
                const item = row && typeof row === "object" ? (row as Record<string, unknown>) : {};
                return (
                  <tr key={`row_${rowIndex}`} className="hover:bg-zinc-800/30 transition-colors">
                    {columns.map((column) => {
                      const value = item[column.key];
                      const text =
                        typeof value === "number" ? value.toLocaleString() : value === undefined ? "-" : String(value);
                      return (
                        <td
                          key={`${rowIndex}_${column.key}`}
                          className={`px-3 py-2 ${column.align === "right" ? "text-right font-mono" : "text-left"}`}
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
    </div>
  );
}

function UnknownBlock({ block }: { block: StreamBlock }) {
  return (
    <pre className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-xs text-zinc-300">
      {JSON.stringify(block, null, 2)}
    </pre>
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
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-8 text-center text-zinc-500">
            No blocks to display. Start a stream to see content.
          </div>
        ) : (
          blocks.map((block) => (
            <RenderBlock
              key={block.id}
              block={block}
              granularity={granularity}
              onGranularityChange={onGranularityChange}
              isGranularityOption={isGranularityOption}
            />
          ))
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
      {blocks.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-8 text-center text-zinc-500 lg:col-span-2">
          No blocks to display. Start a stream to see content.
        </div>
      ) : (
        blocks.map((block) => {
          const column = resolveColumn(block, true);
          const className = column === "full" ? "lg:col-span-2" : "";
          return (
            <div key={block.id} className={className}>
              <RenderBlock
                block={block}
                granularity={granularity}
                onGranularityChange={onGranularityChange}
                isGranularityOption={isGranularityOption}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
