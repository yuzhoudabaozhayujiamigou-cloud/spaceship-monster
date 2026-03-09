"use client";

import { useMemo, useState } from "react";

import {
  estimateNextQuotaRange,
  estimateQuotaValue,
  normalizeQuotaNumber,
} from "./quotaMath";

function toUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

function clampMin(value: number, min: number): number {
  return Number.isFinite(value) ? Math.max(min, value) : min;
}

export default function QuotaCalculatorClient() {
  const [quotaNumber, setQuotaNumber] = useState(1);
  const [currentValue, setCurrentValue] = useState(0);
  const [daysLeftInput, setDaysLeftInput] = useState("");

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

  const stillNeeded = Math.max(0, currentQuota - currentValue);
  const safe10Target = Math.ceil(currentQuota * 1.1);
  const safe20Target = Math.ceil(currentQuota * 1.2);
  const stillNeededSafe10 = Math.max(0, safe10Target - currentValue);
  const stillNeededSafe20 = Math.max(0, safe20Target - currentValue);

  const perDayBase = daysLeft ? Math.ceil(stillNeeded / daysLeft) : null;
  const perDaySafe10 = daysLeft ? Math.ceil(stillNeededSafe10 / daysLeft) : null;
  const perDaySafe20 = daysLeft ? Math.ceil(stillNeededSafe20 / daysLeft) : null;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">
            Current quota number
          </span>
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
          <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">
            Current money + ship scrap
          </span>
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
          <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">
            Days left (optional)
          </span>
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
          <div className="text-xs font-mono uppercase tracking-wide text-zinc-500">
            Current quota target
          </div>
          <p className="mt-2 text-2xl font-semibold text-zinc-100">{toUsd(currentQuota)}</p>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
          <div className="text-xs font-mono uppercase tracking-wide text-zinc-500">
            Next quota value
          </div>
          <p className="mt-2 text-2xl font-semibold text-zinc-100">{toUsd(nextQuota)}</p>
          <p className="mt-2 text-xs text-zinc-500">
            Common roll range: {toUsd(nextRange.low)} to {toUsd(nextRange.high)}
          </p>
        </article>

        <article
          className={`rounded-xl border p-4 ${
            stillNeeded === 0
              ? "border-emerald-600/40 bg-emerald-500/10"
              : "border-amber-600/40 bg-amber-500/10"
          }`}
        >
          <div className="text-xs font-mono uppercase tracking-wide text-zinc-300">
            How much you still need
          </div>
          <p className="mt-2 text-2xl font-semibold text-zinc-100">{toUsd(stillNeeded)}</p>
          {daysLeft && perDayBase !== null ? (
            <p className="mt-2 text-xs text-zinc-300">About {toUsd(perDayBase)} per day for base quota.</p>
          ) : null}
        </article>

        <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
          <div className="text-xs font-mono uppercase tracking-wide text-zinc-500">
            Safe target recommendation
          </div>
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

      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-400">
        <p>
          This calculator uses the vanilla baseline roll (multiplier 1.0). Actual next quota can vary because
          the game applies a random multiplier each cycle.
        </p>
      </div>
    </section>
  );
}
