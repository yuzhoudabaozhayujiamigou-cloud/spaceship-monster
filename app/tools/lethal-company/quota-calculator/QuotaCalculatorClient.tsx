"use client";

import { useEffect, useMemo, useState } from "react";

type GoalMode = "hit-quota" | "safe-15" | "safe-30";

type ExamplePreset = {
  label: string;
  cycle: number;
  target: number;
  sold: number;
  ship: number;
  mode: GoalMode;
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

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const cycle = Number(params.get("cycle") ?? "1");
      const target = Number(params.get("target") ?? "");
      const sold = Number(params.get("sold") ?? "0");
      const ship = Number(params.get("ship") ?? "0");
      const modeRaw = params.get("mode");

      const nextCycle = Number.isFinite(cycle) ? Math.max(1, Math.floor(cycle)) : 1;
      setQuotaCycle(nextCycle);

      if (Number.isFinite(target) && target >= 0) {
        setQuotaTarget(target);
        setTargetManuallyEdited(true);
      } else {
        setQuotaTarget(estimateQuotaTarget(nextCycle));
      }

      setAlreadySold(Number.isFinite(sold) ? Math.max(0, sold) : 0);
      setShipScrapTotal(Number.isFinite(ship) ? Math.max(0, ship) : 0);

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
    setAlreadySold(example.sold);
    setShipScrapTotal(example.ship);
    setGoalMode(example.mode);
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
    url.searchParams.set("cycle", String(quotaCycle));
    url.searchParams.set("target", String(Math.round(result.target)));
    url.searchParams.set("sold", String(Math.round(result.sold)));
    url.searchParams.set("ship", String(Math.round(result.ship)));
    url.searchParams.set("mode", goalMode);
    await copyWithToast(url.toString(), "Copied share link");
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
            onChange={(v) => {
              setQuotaTarget(v);
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
              onChange={(e) => setGoalMode(e.target.value as GoalMode)}
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
          <Readout
            label="Goal target"
            value={result.goalTarget}
            accent="zinc"
          />
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
          <button
            type="button"
            onClick={copyLink}
            className="rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
          >
            Copy link
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
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
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
        step={1}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
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
