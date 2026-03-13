"use client";

import { useMemo, useState } from "react";

import { estimateNextQuotaRange, estimateQuotaValue, normalizeQuotaNumber } from "./quotaMath";

function toUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

function clampMin(value: number, min: number): number {
  return Number.isFinite(value) ? Math.max(min, value) : min;
}

type SellPlanInput = {
  currentQuotaTarget: number;
  currentMoney: number;
  scrapValueOnShip: number;
  earlySellPenaltyPct: number; // e.g. 0.2 = sell at 80%
  plannedPurchases: number;
  targetEndMoney: number;
};

type SellPlanResult = {
  effectiveScrapValue: number;
  minSellToday: number;
  afterSellMoneyIfMin: number;
  hitsQuota: boolean;
  hitsTarget: boolean;
  keepScrapValueIfMin: number;
};

function computeSellPlan(input: SellPlanInput): SellPlanResult {
  const {
    currentQuotaTarget,
    currentMoney,
    scrapValueOnShip,
    earlySellPenaltyPct,
    plannedPurchases,
    targetEndMoney,
  } = input;

  const effectiveScrapValue = Math.floor(scrapValueOnShip * (1 - earlySellPenaltyPct));

  // Sell contributes to money; purchases reduce money.
  // Need: (currentMoney + sell - plannedPurchases) >= currentQuotaTarget
  const neededForQuota = Math.max(0, currentQuotaTarget + plannedPurchases - currentMoney);
  const minSellToday = Math.min(effectiveScrapValue, neededForQuota);

  const afterSellMoneyIfMin = currentMoney + minSellToday - plannedPurchases;
  const hitsQuota = afterSellMoneyIfMin >= currentQuotaTarget;
  const hitsTarget = afterSellMoneyIfMin >= targetEndMoney;

  const keepScrapValueIfMin = Math.max(0, effectiveScrapValue - minSellToday);

  return {
    effectiveScrapValue,
    minSellToday,
    afterSellMoneyIfMin,
    hitsQuota,
    hitsTarget,
    keepScrapValueIfMin,
  };
}

export default function QuotaCalculatorClient() {
  const [quotaNumber, setQuotaNumber] = useState(1);

  // Existing input preserved
  const [currentValue, setCurrentValue] = useState(0);
  const [daysLeftInput, setDaysLeftInput] = useState("");

  // New MVP inputs
  const [shipMoney, setShipMoney] = useState(0);
  const [scrapValueOnShip, setScrapValueOnShip] = useState(0);
  const [plannedPurchases, setPlannedPurchases] = useState(0);
  const [targetEndMoney, setTargetEndMoney] = useState(0);
  const [sellTiming, setSellTiming] = useState<"deadline" | "early">("deadline");

  const daysLeft = useMemo(() => {
    if (!daysLeftInput) {
      return null;
    }

    const parsed = Number.parseInt(daysLeftInput, 10);
    if (Number.isNaN(parsed)) {
      return null;
    }

    return clampMin(parsed, 1);
  }, [daysLeftInput]);

  const normalizedQuotaNumber = normalizeQuotaNumber(quotaNumber);
  const currentQuota = estimateQuotaValue(normalizedQuotaNumber, 1);
  const nextQuota = estimateQuotaValue(normalizedQuotaNumber + 1, 1);
  const nextRange = estimateNextQuotaRange(normalizedQuotaNumber);

  // Keep old calc for backward compatibility
  const stillNeeded = Math.max(0, currentQuota - currentValue);
  const safe10Target = Math.ceil(currentQuota * 1.1);
  const safe20Target = Math.ceil(currentQuota * 1.2);
  const stillNeededSafe10 = Math.max(0, safe10Target - currentValue);
  const stillNeededSafe20 = Math.max(0, safe20Target - currentValue);

  const perDayBase = daysLeft ? Math.ceil(stillNeeded / daysLeft) : null;
  const perDaySafe10 = daysLeft ? Math.ceil(stillNeededSafe10 / daysLeft) : null;
  const perDaySafe20 = daysLeft ? Math.ceil(stillNeededSafe20 / daysLeft) : null;

  // New sell plan
  const earlySellPenaltyPct = sellTiming === "early" ? 0.2 : 0; // MVP assumption

  const sellPlanSafe = computeSellPlan({
    currentQuotaTarget: currentQuota,
    currentMoney: shipMoney,
    scrapValueOnShip,
    earlySellPenaltyPct,
    plannedPurchases,
    targetEndMoney,
  });

  const sellPlanAggressive = computeSellPlan({
    currentQuotaTarget: currentQuota,
    currentMoney: shipMoney,
    scrapValueOnShip,
    earlySellPenaltyPct: Math.min(0.3, earlySellPenaltyPct + 0.1), // simple aggressive scenario
    plannedPurchases,
    targetEndMoney,
  });

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">Current quota number</span>
          <input
            type="number"
            min={1}
            value={quotaNumber}
            onChange={(event) => {
              const parsed = Number.parseInt(event.target.value, 10);
              setQuotaNumber(Number.isNaN(parsed) ? 1 : clampMin(parsed, 1));
            }}
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600"
          />
        </label>

        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">Current money + ship scrap (legacy)</span>
          <input
            type="number"
            min={0}
            value={currentValue}
            onChange={(event) => {
              const parsed = Number.parseInt(event.target.value, 10);
              setCurrentValue(Number.isNaN(parsed) ? 0 : clampMin(parsed, 0));
            }}
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600"
          />
        </label>

        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">Days left (optional)</span>
          <input
            type="number"
            min={1}
            placeholder="e.g. 2"
            value={daysLeftInput}
            onChange={(event) => {
              const raw = event.target.value;
              if (raw === "") {
                setDaysLeftInput("");
                return;
              }

              const parsed = Number.parseInt(raw, 10);
              if (Number.isNaN(parsed)) {
                return;
              }

              setDaysLeftInput(String(clampMin(parsed, 1)));
            }}
            className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600"
          />
        </label>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
          <div className="text-xs font-mono uppercase tracking-wide text-zinc-500">Current quota target</div>
          <p className="mt-2 text-2xl font-semibold text-zinc-100">{toUsd(currentQuota)}</p>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
          <div className="text-xs font-mono uppercase tracking-wide text-zinc-500">Next quota value</div>
          <p className="mt-2 text-2xl font-semibold text-zinc-100">{toUsd(nextQuota)}</p>
          <p className="mt-2 text-xs text-zinc-500">
            Common roll range: {toUsd(nextRange.low)} to {toUsd(nextRange.high)}
          </p>
        </article>

        <article
          className={`rounded-xl border p-4 ${
            stillNeeded === 0 ? "border-emerald-600/40 bg-emerald-500/10" : "border-amber-600/40 bg-amber-500/10"
          }`}
        >
          <div className="text-xs font-mono uppercase tracking-wide text-zinc-300">How much you still need</div>
          <p className="mt-2 text-2xl font-semibold text-zinc-100">{toUsd(stillNeeded)}</p>
          {daysLeft && perDayBase !== null ? (
            <p className="mt-2 text-xs text-zinc-300">About {toUsd(perDayBase)} per day for base quota.</p>
          ) : null}
        </article>

        <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
          <div className="text-xs font-mono uppercase tracking-wide text-zinc-500">Safe target recommendation</div>
          <p className="mt-2 text-sm text-zinc-300">
            +10%: {toUsd(safe10Target)} ({toUsd(stillNeededSafe10)} left)
          </p>
          <p className="mt-1 text-sm text-zinc-300">
            +20%: {toUsd(safe20Target)} ({toUsd(stillNeededSafe20)} left)
          </p>
          {daysLeft && perDaySafe10 !== null && perDaySafe20 !== null ? (
            <p className="mt-2 text-xs text-zinc-500">
              Pace: {toUsd(perDaySafe10)}/day (+10%), {toUsd(perDaySafe20)}/day (+20%).
            </p>
          ) : null}
        </article>
      </div>

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
        <h3 className="text-sm font-semibold text-zinc-100">Sell planning (MVP)</h3>
        <p className="mt-1 text-xs text-zinc-400">
          This is a simple planning helper. It assumes an early-sell penalty when you sell before the deadline.
          Adjust the penalty later if you confirm exact behavior.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
          <label className="block md:col-span-1">
            <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">Ship money</span>
            <input
              type="number"
              min={0}
              value={shipMoney}
              onChange={(e) => setShipMoney(clampMin(Number.parseInt(e.target.value || "0", 10), 0))}
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            />
          </label>

          <label className="block md:col-span-1">
            <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">Scrap value on ship</span>
            <input
              type="number"
              min={0}
              value={scrapValueOnShip}
              onChange={(e) => setScrapValueOnShip(clampMin(Number.parseInt(e.target.value || "0", 10), 0))}
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            />
          </label>

          <label className="block md:col-span-1">
            <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">Planned purchases</span>
            <input
              type="number"
              min={0}
              value={plannedPurchases}
              onChange={(e) => setPlannedPurchases(clampMin(Number.parseInt(e.target.value || "0", 10), 0))}
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            />
          </label>

          <label className="block md:col-span-1">
            <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">Target end money</span>
            <input
              type="number"
              min={0}
              value={targetEndMoney}
              onChange={(e) => setTargetEndMoney(clampMin(Number.parseInt(e.target.value || "0", 10), 0))}
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            />
          </label>

          <label className="block md:col-span-1">
            <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">Sell timing</span>
            <select
              value={sellTiming}
              onChange={(e) => setSellTiming(e.target.value === "early" ? "early" : "deadline")}
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            >
              <option value="deadline">Sell at deadline (no penalty)</option>
              <option value="early">Sell early (assume -20%)</option>
            </select>
          </label>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-100">Safe</div>
              <div className="text-xs text-zinc-500">Penalty: {(earlySellPenaltyPct * 100).toFixed(0)}%</div>
            </div>
            <div className="mt-3 text-sm text-zinc-300">
              <div>Effective scrap value: <span className="font-mono text-zinc-100">{toUsd(sellPlanSafe.effectiveScrapValue)}</span></div>
              <div className="mt-1">Minimum to sell today: <span className="font-mono text-zinc-100">{toUsd(sellPlanSafe.minSellToday)}</span></div>
              <div className="mt-1">Money after selling min: <span className="font-mono text-zinc-100">{toUsd(sellPlanSafe.afterSellMoneyIfMin)}</span></div>
              <div className="mt-1">Keeps (effective) scrap value: <span className="font-mono text-zinc-100">{toUsd(sellPlanSafe.keepScrapValueIfMin)}</span></div>
            </div>
            <div className="mt-3 text-xs">
              <span className={`rounded px-2 py-1 ${sellPlanSafe.hitsQuota ? "bg-emerald-500/15 text-emerald-200" : "bg-amber-500/15 text-amber-200"}`}>
                {sellPlanSafe.hitsQuota ? "Hits quota" : "Does not hit quota"}
              </span>
              <span className={`ml-2 rounded px-2 py-1 ${sellPlanSafe.hitsTarget ? "bg-emerald-500/15 text-emerald-200" : "bg-zinc-800 text-zinc-300"}`}>
                {sellPlanSafe.hitsTarget ? "Hits target" : "Target optional"}
              </span>
            </div>
          </article>

          <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-100">Aggressive</div>
              <div className="text-xs text-zinc-500">Penalty: {((Math.min(0.3, earlySellPenaltyPct + 0.1)) * 100).toFixed(0)}%</div>
            </div>
            <div className="mt-3 text-sm text-zinc-300">
              <div>Effective scrap value: <span className="font-mono text-zinc-100">{toUsd(sellPlanAggressive.effectiveScrapValue)}</span></div>
              <div className="mt-1">Minimum to sell today: <span className="font-mono text-zinc-100">{toUsd(sellPlanAggressive.minSellToday)}</span></div>
              <div className="mt-1">Money after selling min: <span className="font-mono text-zinc-100">{toUsd(sellPlanAggressive.afterSellMoneyIfMin)}</span></div>
              <div className="mt-1">Keeps (effective) scrap value: <span className="font-mono text-zinc-100">{toUsd(sellPlanAggressive.keepScrapValueIfMin)}</span></div>
            </div>
            <div className="mt-3 text-xs">
              <span className={`rounded px-2 py-1 ${sellPlanAggressive.hitsQuota ? "bg-emerald-500/15 text-emerald-200" : "bg-amber-500/15 text-amber-200"}`}>
                {sellPlanAggressive.hitsQuota ? "Hits quota" : "Does not hit quota"}
              </span>
              <span className={`ml-2 rounded px-2 py-1 ${sellPlanAggressive.hitsTarget ? "bg-emerald-500/15 text-emerald-200" : "bg-zinc-800 text-zinc-300"}`}>
                {sellPlanAggressive.hitsTarget ? "Hits target" : "Target optional"}
              </span>
            </div>
          </article>
        </div>

        <p className="mt-3 text-xs text-zinc-500">
          MVP note: Early-sell penalty is a placeholder (20%). If you confirm exact mechanics, we can replace this with the real model.
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-400">
        <p>
          This calculator uses the vanilla baseline roll (multiplier 1.0). Actual next quota can vary because
          the game applies a random multiplier each cycle.
        </p>
      </div>
    </section>
  );
}
