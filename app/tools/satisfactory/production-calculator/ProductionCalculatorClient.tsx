"use client";

import { useMemo, useState } from "react";

import { PRODUCT_OPTIONS } from "../_data/satisfactory";
import {
  adjustBuildingsForClockSpeed,
  adjustNodesForClockSpeed,
  clampClock,
  computeProductionPlan,
} from "../_lib/production";

const PRESETS = [
  { label: "Modular Frames", itemId: "modular-frame", rate: 10 },
  { label: "Heavy Modular Frames", itemId: "heavy-modular-frame", rate: 4 },
  { label: "Computers", itemId: "computer", rate: 12 },
  { label: "Alclad Sheets", itemId: "alclad-aluminum-sheet", rate: 120 },
  { label: "Batteries", itemId: "battery", rate: 80 },
];

function formatNumber(value: number, decimals = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

export default function ProductionCalculatorClient() {
  const [itemId, setItemId] = useState("heavy-modular-frame");
  const [targetRatePerMin, setTargetRatePerMin] = useState(4);
  const [machineClockPercent, setMachineClockPercent] = useState(100);

  const plan = useMemo(
    () => computeProductionPlan(itemId, targetRatePerMin),
    [itemId, targetRatePerMin],
  );

  const safeClock = clampClock(machineClockPercent);

  const buildingRows = useMemo(
    () => adjustBuildingsForClockSpeed(plan.buildingBreakdown, safeClock),
    [plan.buildingBreakdown, safeClock],
  );

  const chainRows = useMemo(
    () => adjustNodesForClockSpeed(plan.chain, safeClock),
    [plan.chain, safeClock],
  );

  const totalAdjustedMachines = buildingRows.reduce((sum, row) => sum + row.adjustedMachines, 0);
  const totalAdjustedPower = buildingRows.reduce((sum, row) => sum + row.adjustedPowerMW, 0);
  const totalAdjustedFootprint = buildingRows.reduce(
    (sum, row) => sum + row.adjustedMachines * row.footprintM2,
    0,
  );

  return (
    <section className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-950/70 to-zinc-950/30 p-5 sm:p-6">
      <h2 className="text-xl font-semibold tracking-tight">Production Calculator</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        Set your target output per minute, then read raw materials, production chain stages, and
        machine counts in one place.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <span className="text-sm font-medium text-zinc-200">Target product</span>
          <select
            value={itemId}
            onChange={(event) => setItemId(event.target.value)}
            className="mt-3 w-full rounded-lg border border-zinc-800 bg-[#0a0a0a] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
          >
            {PRODUCT_OPTIONS.map((item) => (
              <option key={item.itemId} value={item.itemId}>
                {item.itemName}
              </option>
            ))}
          </select>
        </label>

        <label className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <span className="text-sm font-medium text-zinc-200">Target output (per min)</span>
          <input
            type="number"
            min={0}
            step={0.1}
            value={targetRatePerMin}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              setTargetRatePerMin(Number.isFinite(parsed) ? Math.max(0, parsed) : 0);
            }}
            className="mt-3 w-full rounded-lg border border-zinc-800 bg-[#0a0a0a] px-3 py-2 font-mono text-zinc-100 outline-none focus:border-emerald-500/60"
          />
        </label>

        <label className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <span className="text-sm font-medium text-zinc-200">Machine clock speed (%)</span>
          <input
            type="number"
            min={1}
            max={250}
            step={1}
            value={safeClock}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              setMachineClockPercent(Number.isFinite(parsed) ? parsed : 100);
            }}
            className="mt-3 w-full rounded-lg border border-zinc-800 bg-[#0a0a0a] px-3 py-2 font-mono text-zinc-100 outline-none focus:border-emerald-500/60"
          />
          <p className="mt-2 text-xs text-zinc-500">Range: 1% to 250% overclock.</p>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setItemId(preset.itemId);
              setTargetRatePerMin(preset.rate);
            }}
            className="rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-mono text-zinc-200 hover:border-zinc-700"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Target output" value={`${formatNumber(plan.targetRatePerMin)} / min`} />
        <MetricCard label="Total machines" value={formatNumber(totalAdjustedMachines)} />
        <MetricCard label="Estimated power" value={`${formatNumber(totalAdjustedPower)} MW`} />
        <MetricCard
          label="Estimated footprint"
          value={`${formatNumber(totalAdjustedFootprint, 0)} m²`}
        />
      </div>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
          Raw material requirements
        </h3>

        {plan.rawInputs.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-400">No raw inputs for a zero-output target.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-y border-zinc-800 text-left text-xs uppercase tracking-wide text-zinc-400">
                  <th className="px-3 py-2">Resource</th>
                  <th className="px-3 py-2">Rate</th>
                  <th className="px-3 py-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {plan.rawInputs.map((row) => (
                  <tr key={row.itemId} className="border-b border-zinc-900/80 text-zinc-300">
                    <td className="px-3 py-2">{row.itemName}</td>
                    <td className="px-3 py-2 font-mono">
                      {formatNumber(row.ratePerMin)} {row.isFluid ? "m³/min" : "items/min"}
                    </td>
                    <td className="px-3 py-2">{row.isFluid ? "Fluid" : "Solid"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
          Building quantity calculation
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[660px] border-collapse text-sm">
            <thead>
              <tr className="border-y border-zinc-800 text-left text-xs uppercase tracking-wide text-zinc-400">
                <th className="px-3 py-2">Building</th>
                <th className="px-3 py-2">Machines @ {safeClock}%</th>
                <th className="px-3 py-2">Power</th>
                <th className="px-3 py-2">Space</th>
              </tr>
            </thead>
            <tbody>
              {buildingRows.map((row) => (
                <tr key={row.buildingId} className="border-b border-zinc-900/80 text-zinc-300">
                  <td className="px-3 py-2">{row.buildingName}</td>
                  <td className="px-3 py-2 font-mono">{formatNumber(row.adjustedMachines)}</td>
                  <td className="px-3 py-2 font-mono">{formatNumber(row.adjustedPowerMW)} MW</td>
                  <td className="px-3 py-2 font-mono">
                    {formatNumber(row.adjustedMachines * row.footprintM2, 0)} m²
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
          Production chain
        </h3>
        <p className="mt-2 text-xs text-zinc-500">
          Top-down chain from target product to raw resources.
        </p>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-y border-zinc-800 text-left text-xs uppercase tracking-wide text-zinc-400">
                <th className="px-3 py-2">Stage</th>
                <th className="px-3 py-2">Required Rate</th>
                <th className="px-3 py-2">Machines @ {safeClock}%</th>
                <th className="px-3 py-2">Building</th>
              </tr>
            </thead>
            <tbody>
              {chainRows.map((row, index) => (
                <tr key={`${row.itemId}-${index}`} className="border-b border-zinc-900/80 text-zinc-300">
                  <td className="px-3 py-2">
                    <div style={{ paddingLeft: `${row.depth * 16}px` }}>
                      {row.depth > 0 ? "↳ " : ""}
                      {row.itemName}
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono">
                    {formatNumber(row.requiredRatePerMin)} / min
                  </td>
                  <td className="px-3 py-2 font-mono">
                    {row.buildingId ? formatNumber(row.adjustedMachines) : "-"}
                  </td>
                  <td className="px-3 py-2">{row.buildingName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {plan.recursionClamped ? (
          <p className="mt-3 text-xs text-amber-300">
            Chain depth exceeded safety limit. If you edited data, check for circular recipes.
          </p>
        ) : null}
      </section>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-[#0a0a0a] p-4">
      <div className="text-xs font-mono text-zinc-500">{label}</div>
      <div className="mt-2 text-2xl font-mono text-zinc-100">{value}</div>
    </div>
  );
}
