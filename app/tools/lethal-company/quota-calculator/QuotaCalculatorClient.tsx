"use client";

import { useEffect, useMemo, useState } from "react";

type GoalMode = "hit-quota" | "safe-15" | "safe-30";
type ProgressionInputMode = "number" | "value";

type ExamplePreset = {
  label: string;
  cycle: number;
  target: number;
  sold: number;
  ship: number;
  mode: GoalMode;
};

type ProgressionRow = {
  quotaNumber: number;
  quotaValue: number;
  increaseFromPrevious: number;
  cumulativeTotal: number;
  isCurrent: boolean;
  isNext: boolean;
};

const GOAL_MODES: Record<
  GoalMode,
  { label: string; multiplier: number; description: string }
> = {
  "hit-quota": {
    label: "Hit quota only",
    multiplier: 1.0,
    description: "Minimum target to clear the cycle.",
  },
  "safe-15": {
    label: "Safe (+15%)",
    multiplier: 1.15,
    description: "Balanced buffer for moderate run variance.",
  },
  "safe-30": {
    label: "Conservative (+30%)",
    multiplier: 1.3,
    description: "Larger safety margin for unstable runs.",
  },
};

const DEFAULT_NEXT_QUOTAS = 10;
const MAX_NEXT_QUOTAS = 30;

const EXAMPLES: ExamplePreset[] = [
  {
    label: "Cycle 2 stabilize",
    cycle: 2,
    target: 188,
    sold: 65,
    ship: 180,
    mode: "safe-15",
  },
  {
    label: "Cycle 5 catch-up",
    cycle: 5,
    target: 570,
    sold: 220,
    ship: 260,
    mode: "hit-quota",
  },
  {
    label: "Cycle 8 high risk",
    cycle: 8,
    target: 1300,
    sold: 860,
    ship: 520,
    mode: "safe-30",
  },
];

function estimateQuotaTarget(cycle: number) {
  const safeCycle = Math.max(1, Math.floor(cycle));
  return Math.max(0, Math.round(130 * Math.pow(1.45, safeCycle - 1)));
}

function quotaValueFromNumber(quotaNumber: number) {
  const safeQuotaNumber = Math.max(1, Math.floor(quotaNumber));
  const nMinusOne = safeQuotaNumber - 1;
  return Math.round(130 + 25 * nMinusOne + (25 * nMinusOne * (nMinusOne - 1)) / 2);
}

function cumulativeQuotaTotal(quotaNumber: number) {
  const safeQuotaNumber = Math.max(1, Math.floor(quotaNumber));
  let total = 0;

  for (let index = 1; index <= safeQuotaNumber; index += 1) {
    total += quotaValueFromNumber(index);
  }

  return total;
}

function resolveQuotaNumberFromValue(rawQuotaValue: number) {
  const quotaValue = clampMinZero(rawQuotaValue);
  let quotaNumber = 1;

  while (quotaNumber < 200 && quotaValueFromNumber(quotaNumber) < quotaValue) {
    quotaNumber += 1;
  }

  return {
    quotaNumber,
    exact: quotaValueFromNumber(quotaNumber) === quotaValue,
  };
}

function normalizeNextQuotaCount(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_NEXT_QUOTAS;
  }
  return Math.max(1, Math.min(MAX_NEXT_QUOTAS, Math.floor(value)));
}

function parseNumberParam(params: URLSearchParams, key: string) {
  const raw = params.get(key);
  if (raw === null || raw.trim() === "") {
    return null;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function fmtInt(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Math.round(value),
  );
}

function clampMinZero(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
}

export default function QuotaCalculatorClient() {
  const [quotaCycle, setQuotaCycle] = useState(1);
  const [quotaTarget, setQuotaTarget] = useState(130);
  const [targetManuallyEdited, setTargetManuallyEdited] = useState(false);
  const [progressionInputMode, setProgressionInputMode] =
    useState<ProgressionInputMode>("number");
  const [currentQuotaValueInput, setCurrentQuotaValueInput] = useState(130);
  const [nextQuotaCount, setNextQuotaCount] = useState(DEFAULT_NEXT_QUOTAS);
  const [alreadySold, setAlreadySold] = useState(0);
  const [shipScrapTotal, setShipScrapTotal] = useState(0);
  const [goalMode, setGoalMode] = useState<GoalMode>("safe-15");
  const [toast, setToast] = useState<string | null>(null);

  const cycleEstimate = useMemo(
    () => estimateQuotaTarget(quotaCycle),
    [quotaCycle],
  );

  const result = useMemo(() => {
    const target = clampMinZero(quotaTarget);
    const sold = clampMinZero(alreadySold);
    const ship = clampMinZero(shipScrapTotal);
    const mode = GOAL_MODES[goalMode];

    const goalTarget = Math.ceil(target * mode.multiplier);
    const remainingToHitQuota = Math.max(target - sold, 0);
    const minimalSell = Math.max(goalTarget - sold, 0);
    const projectedAfterShipSell = sold + ship;
    const safetyMargin = projectedAfterShipSell - goalTarget;
    const shipCoveragePct =
      minimalSell > 0
        ? Math.min((ship / minimalSell) * 100, 999)
        : 100;

    return {
      target,
      sold,
      ship,
      goalTarget,
      remainingToHitQuota,
      minimalSell,
      projectedAfterShipSell,
      safetyMargin,
      shipCoveragePct,
      mode,
    };
  }, [alreadySold, goalMode, quotaTarget, shipScrapTotal]);

  const boundedNextQuotaCount = useMemo(
    () => normalizeNextQuotaCount(nextQuotaCount),
    [nextQuotaCount],
  );

  const progressionStart = useMemo(() => {
    if (progressionInputMode === "number") {
      const quotaNumber = Math.max(1, Math.floor(quotaCycle));
      const quotaValue = quotaValueFromNumber(quotaNumber);
      return {
        quotaNumber,
        inputQuotaValue: quotaValue,
        matchedQuotaValue: quotaValue,
        exactMatch: true,
      };
    }

    const inputQuotaValue = clampMinZero(currentQuotaValueInput);
    const resolved = resolveQuotaNumberFromValue(inputQuotaValue);

    return {
      quotaNumber: resolved.quotaNumber,
      inputQuotaValue,
      matchedQuotaValue: quotaValueFromNumber(resolved.quotaNumber),
      exactMatch: resolved.exact,
    };
  }, [currentQuotaValueInput, progressionInputMode, quotaCycle]);

  const progressionRows = useMemo<ProgressionRow[]>(() => {
    return Array.from({ length: boundedNextQuotaCount + 1 }, (_, index) => {
      const quotaNumber = progressionStart.quotaNumber + index;
      const quotaValue = quotaValueFromNumber(quotaNumber);
      const previousValue = quotaNumber > 1 ? quotaValueFromNumber(quotaNumber - 1) : 0;

      return {
        quotaNumber,
        quotaValue,
        increaseFromPrevious: quotaNumber === 1 ? 0 : quotaValue - previousValue,
        cumulativeTotal: cumulativeQuotaTotal(quotaNumber),
        isCurrent: index === 0,
        isNext: index === 1,
      };
    });
  }, [boundedNextQuotaCount, progressionStart.quotaNumber]);

  const progressionValidationMessage = useMemo(() => {
    if (progressionInputMode !== "value" || progressionStart.exactMatch) {
      return null;
    }

    if (progressionStart.quotaNumber === 1) {
      return `Quota value ${fmtInt(progressionStart.inputQuotaValue)} is below quota #1 (${fmtInt(
        progressionStart.matchedQuotaValue,
      )}). Using quota #1 for projections.`;
    }

    const previousQuotaNumber = progressionStart.quotaNumber - 1;
    const previousQuotaValue = quotaValueFromNumber(previousQuotaNumber);
    return `Quota value ${fmtInt(
      progressionStart.inputQuotaValue,
    )} is between quota #${previousQuotaNumber} (${fmtInt(
      previousQuotaValue,
    )}) and quota #${progressionStart.quotaNumber} (${fmtInt(
      progressionStart.matchedQuotaValue,
    )}).`;
  }, [progressionInputMode, progressionStart]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const quotaParam = parseNumberParam(params, "quota");
      const cycleParam = parseNumberParam(params, "cycle");
      const targetParam = parseNumberParam(params, "target");
      const soldParam = parseNumberParam(params, "sold");
      const shipParam = parseNumberParam(params, "ship");
      const nextParam = parseNumberParam(params, "next");
      const quotaValueParam = parseNumberParam(params, "quotaValue");
      const inputModeRaw = params.get("input");
      const modeRaw = params.get("mode");

      const cycleSource = quotaParam ?? cycleParam ?? 1;
      const nextCycle = Math.max(1, Math.floor(cycleSource));
      setQuotaCycle(nextCycle);

      if (targetParam !== null && targetParam >= 0) {
        setQuotaTarget(targetParam);
        setTargetManuallyEdited(true);
      } else {
        setQuotaTarget(estimateQuotaTarget(nextCycle));
        setTargetManuallyEdited(false);
      }

      setAlreadySold(soldParam !== null ? Math.max(0, soldParam) : 0);
      setShipScrapTotal(shipParam !== null ? Math.max(0, shipParam) : 0);
      setCurrentQuotaValueInput(
        quotaValueParam !== null && quotaValueParam >= 0
          ? quotaValueParam
          : targetParam !== null && targetParam >= 0
            ? targetParam
            : quotaValueFromNumber(nextCycle),
      );
      setNextQuotaCount(
        nextParam !== null ? normalizeNextQuotaCount(nextParam) : DEFAULT_NEXT_QUOTAS,
      );

      if (inputModeRaw === "number" || inputModeRaw === "value") {
        setProgressionInputMode(inputModeRaw);
      }

      if (modeRaw === "hit-quota" || modeRaw === "safe-15" || modeRaw === "safe-30") {
        setGoalMode(modeRaw);
      }
    } catch {
      // Ignore malformed URL params.
    }
  }, []);

  function handleCycleChange(value: number) {
    const nextCycle = Math.max(1, Math.floor(value || 1));
    setQuotaCycle(nextCycle);
    if (!targetManuallyEdited) {
      setQuotaTarget(estimateQuotaTarget(nextCycle));
    }
  }

  function resetTargetToCycleEstimate() {
    setQuotaTarget(cycleEstimate);
    setTargetManuallyEdited(false);
  }

  function applyExample(example: ExamplePreset) {
    setQuotaCycle(example.cycle);
    setQuotaTarget(example.target);
    setTargetManuallyEdited(true);
    setCurrentQuotaValueInput(example.target);
    setAlreadySold(example.sold);
    setShipScrapTotal(example.ship);
    setGoalMode(example.mode);
    setProgressionInputMode("number");
  }

  async function copySummary() {
    const summary =
      `Cycle ${quotaCycle} plan: target ${fmtInt(result.target)}, sold ${fmtInt(result.sold)}. ` +
      `Goal mode ${result.mode.label} (${fmtInt(result.goalTarget)}). ` +
      `Remaining to hit quota ${fmtInt(result.remainingToHitQuota)}. ` +
      `Minimal sell for goal ${fmtInt(result.minimalSell)}. ` +
      `Safety margin after selling ship scrap (${fmtInt(result.ship)}): ${result.safetyMargin >= 0 ? "+" : ""}${fmtInt(result.safetyMargin)}.`;

    await copyWithToast(summary, "Copied result summary");
  }

  async function copyLink() {
    const url = new URL(window.location.href);
    url.searchParams.set("quota", String(progressionStart.quotaNumber));
    url.searchParams.set("input", progressionInputMode);
    url.searchParams.set("next", String(boundedNextQuotaCount));
    if (progressionInputMode === "value") {
      url.searchParams.set("quotaValue", String(Math.round(progressionStart.inputQuotaValue)));
    } else {
      url.searchParams.delete("quotaValue");
    }
    url.searchParams.set("cycle", String(quotaCycle));
    url.searchParams.set("target", String(Math.round(result.target)));
    url.searchParams.set("sold", String(Math.round(result.sold)));
    url.searchParams.set("ship", String(Math.round(result.ship)));
    url.searchParams.set("mode", goalMode);
    await copyWithToast(url.toString(), "Copied share link");
  }

  async function copyProgressionTable() {
    const header = "Quota #\tQuota Value\tIncrease from Previous\tCumulative Total";
    const rows = progressionRows.map((row) =>
      [
        row.quotaNumber,
        row.quotaValue,
        row.quotaNumber === 1 ? 0 : row.increaseFromPrevious,
        row.cumulativeTotal,
      ].join("\t"),
    );
    await copyWithToast([header, ...rows].join("\n"), "Copied quota table");
  }

  async function copyWithToast(value: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(value);
      setToast(successMessage);
    } catch {
      setToast("Copy failed");
    } finally {
      window.setTimeout(() => setToast(null), 1400);
    }
  }

  return (
    <>
      {toast ? (
        <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-full border border-zinc-700 bg-zinc-950/90 px-4 py-2 text-xs font-mono text-zinc-100 shadow-lg">
          {toast}
        </div>
      ) : null}

      <section
        id="calculator"
        className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-950/70 to-zinc-950/30 p-5 sm:p-6"
      >
        <h2 className="text-xl font-semibold tracking-tight">Calculator</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Use quota number or quota value to project upcoming quotas, then plan how much your team
          should sell with a risk buffer.
        </p>

        <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 sm:p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
            Quota progression
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setProgressionInputMode("number")}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                progressionInputMode === "number"
                  ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                  : "border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              Current quota number
            </button>
            <button
              type="button"
              onClick={() => setProgressionInputMode("value")}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                progressionInputMode === "value"
                  ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                  : "border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              Current quota value
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {progressionInputMode === "number" ? (
              <InputField
                label="Current quota number"
                hint="1, 2, 3..."
                value={quotaCycle}
                min={1}
                onChange={handleCycleChange}
              />
            ) : (
              <InputField
                label="Current quota value"
                hint="130, 195..."
                value={currentQuotaValueInput}
                min={0}
                onChange={setCurrentQuotaValueInput}
              />
            )}

            <InputField
              label="Show next quotas"
              hint={`Default ${DEFAULT_NEXT_QUOTAS}`}
              value={boundedNextQuotaCount}
              min={1}
              max={MAX_NEXT_QUOTAS}
              onChange={setNextQuotaCount}
            />

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <div className="text-sm font-medium text-zinc-200">Projection start</div>
              <div className="mt-2 text-xs font-mono text-zinc-500">Mapped from your input</div>
              <div className="mt-3 text-sm text-zinc-300">
                Quota #{progressionStart.quotaNumber} ={" "}
                <span className="font-mono text-zinc-100">
                  {fmtInt(progressionStart.matchedQuotaValue)}
                </span>
              </div>
              {!progressionStart.exactMatch && progressionInputMode === "value" ? (
                <div className="mt-2 text-xs text-amber-300">Nearest valid quota checkpoint</div>
              ) : null}
            </div>
          </div>

          {progressionValidationMessage ? (
            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-100">
              {progressionValidationMessage}
            </div>
          ) : null}

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-sm">
              <thead>
                <tr className="border-y border-zinc-800 text-left text-xs uppercase tracking-wide text-zinc-400">
                  <th className="px-3 py-2">Quota #</th>
                  <th className="px-3 py-2">Quota Value</th>
                  <th className="px-3 py-2">Increase from Previous</th>
                  <th className="px-3 py-2">Cumulative Total</th>
                </tr>
              </thead>
              <tbody>
                {progressionRows.map((row) => (
                  <tr
                    key={row.quotaNumber}
                    className={`border-b border-zinc-900/80 ${
                      row.isNext
                        ? "bg-emerald-500/10 font-semibold text-emerald-100"
                        : row.isCurrent
                          ? "bg-zinc-900/70 text-zinc-100"
                          : "text-zinc-300"
                    }`}
                  >
                    <td className="px-3 py-2">#{row.quotaNumber}</td>
                    <td className="px-3 py-2 font-mono">{fmtInt(row.quotaValue)}</td>
                    <td className="px-3 py-2 font-mono">
                      {row.quotaNumber === 1 ? "-" : `+${fmtInt(row.increaseFromPrevious)}`}
                    </td>
                    <td className="px-3 py-2 font-mono">{fmtInt(row.cumulativeTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyProgressionTable}
              className="rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Copy table
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Copy permalink
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
            Sell planning
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            Existing planner logic is unchanged. You can still override target manually and use
            goal modes to choose your safety buffer.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <InputField
            label="Quota cycle"
            hint="Current cycle"
            value={quotaCycle}
            min={1}
            onChange={handleCycleChange}
          />
          <InputField
            label="Quota target"
            hint="Editable"
            value={quotaTarget}
            min={0}
            onChange={(value) => {
              setQuotaTarget(value);
              setTargetManuallyEdited(true);
            }}
          />
          <InputField
            label="Already sold"
            hint="Counted value"
            value={alreadySold}
            min={0}
            onChange={setAlreadySold}
          />
          <InputField
            label="Ship scrap total"
            hint="Optional"
            value={shipScrapTotal}
            min={0}
            onChange={setShipScrapTotal}
          />
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
            <div className="text-sm font-medium text-zinc-200">Goal mode</div>
            <div className="mt-2 text-xs font-mono text-zinc-500">Plan style</div>
            <select
              value={goalMode}
              onChange={(event) => setGoalMode(event.target.value as GoalMode)}
              className="mt-3 w-full rounded-lg border border-zinc-800 bg-[#0a0a0a] px-3 py-2 font-mono text-zinc-100 outline-none focus:border-emerald-500/60"
            >
              {Object.entries(GOAL_MODES).map(([value, mode]) => (
                <option key={value} value={value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span>Cycle estimate: {fmtInt(cycleEstimate)}</span>
          <button
            type="button"
            onClick={resetTargetToCycleEstimate}
            className="rounded-full border border-zinc-700 bg-[#0a0a0a] px-3 py-1 text-zinc-200 hover:bg-zinc-950/60"
          >
            Use cycle estimate
          </button>
          <span>·</span>
          <span>{GOAL_MODES[goalMode].description}</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Readout
            label="Remaining to hit quota"
            value={result.remainingToHitQuota}
            accent="amber"
          />
          <Readout label="Minimal sell (goal mode)" value={result.minimalSell} accent="emerald" />
          <Readout
            label="Safety margin"
            value={result.safetyMargin}
            accent={result.safetyMargin >= 0 ? "emerald" : "zinc"}
            showPlusMinus
          />
          <Readout label="Goal target" value={result.goalTarget} accent="zinc" />
        </div>

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-400">
          Ship coverage for selected goal mode:{" "}
          <span className="font-mono text-zinc-200">{fmtInt(result.shipCoveragePct)}%</span>
          {" · "}
          Projected total if sold now:{" "}
          <span className="font-mono text-zinc-200">{fmtInt(result.projectedAfterShipSell)}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => applyExample(example)}
              className="rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-mono text-zinc-200 hover:border-zinc-700"
            >
              {example.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copySummary}
            className="rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
          >
            Copy results
          </button>
        </div>
      </section>
    </>
  );
}

function InputField({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-zinc-200">{label}</span>
        <span className="text-xs font-mono text-zinc-500">{hint}</span>
      </div>
      <input
        type="number"
        inputMode="numeric"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={1}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          const safeParsed = Number.isFinite(parsed) ? parsed : min;
          const minBounded = Math.max(min, safeParsed);
          onChange(max === undefined ? minBounded : Math.min(max, minBounded));
        }}
        className="mt-3 w-full rounded-lg border border-zinc-800 bg-[#0a0a0a] px-3 py-2 font-mono text-zinc-100 outline-none focus:border-emerald-500/60"
      />
    </div>
  );
}

function Readout({
  label,
  value,
  accent,
  showPlusMinus = false,
}: {
  label: string;
  value: number;
  accent: "emerald" | "amber" | "zinc";
  showPlusMinus?: boolean;
}) {
  const color =
    accent === "emerald"
      ? "text-emerald-300"
      : accent === "amber"
        ? "text-amber-300"
        : "text-zinc-200";

  const rendered = showPlusMinus
    ? `${value >= 0 ? "+" : "-"}${fmtInt(Math.abs(value))}`
    : fmtInt(value);

  return (
    <div className="rounded-lg border border-zinc-800 bg-[#0a0a0a] p-4">
      <div className="text-xs font-mono text-zinc-500">{label}</div>
      <div className={`mt-2 text-2xl font-mono ${color}`}>{rendered}</div>
    </div>
  );
}
