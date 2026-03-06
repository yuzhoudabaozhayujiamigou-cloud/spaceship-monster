"use client";

import { useMemo, useState } from "react";

import { PRODUCT_OPTIONS } from "../_data/satisfactory";
import { adjustBuildingsForClockSpeed, clampClock, computeProductionPlan } from "../_lib/production";

type LayoutStyle = "bus" | "modular" | "vertical";

type LayoutPreset = {
  id: LayoutStyle;
  name: string;
  spacingFactor: number;
  logisticsNote: string;
  recommendation: string;
};

const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: "bus",
    name: "Main Bus",
    spacingFactor: 1.35,
    logisticsNote: "High belt visibility, easy debugging, widest footprint.",
    recommendation: "Best for early and mid-game readability.",
  },
  {
    id: "modular",
    name: "Modular Blocks",
    spacingFactor: 1.2,
    logisticsNote: "Split lines by item family with clear interfaces.",
    recommendation: "Balanced footprint and expandability.",
  },
  {
    id: "vertical",
    name: "Vertical Stack",
    spacingFactor: 1.1,
    logisticsNote: "Compact ground usage, more lifts and floor routing.",
    recommendation: "Best when land is limited or train stations are dense.",
  },
];

const EXAMPLE_PRESETS = [
  { label: "HMF District", itemId: "heavy-modular-frame", rate: 8, style: "modular" as LayoutStyle },
  { label: "Computer Campus", itemId: "computer", rate: 20, style: "vertical" as LayoutStyle },
  { label: "Battery Wing", itemId: "battery", rate: 100, style: "bus" as LayoutStyle },
];

function formatNumber(value: number, decimals = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

export default function BuildingPlannerClient() {
  const [itemId, setItemId] = useState("heavy-modular-frame");
  const [targetRatePerMin, setTargetRatePerMin] = useState(8);
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>("modular");
  const [machineClockPercent, setMachineClockPercent] = useState(100);
  const [areaPerFloorM2, setAreaPerFloorM2] = useState(2200);
  const [maxMachinesPerFloor, setMaxMachinesPerFloor] = useState(50);

  const safeClock = clampClock(machineClockPercent);
  const safeFloorArea = Number.isFinite(areaPerFloorM2) ? Math.max(100, areaPerFloorM2) : 2200;
  const safeMaxMachinesPerFloor = Number.isFinite(maxMachinesPerFloor)
    ? Math.max(5, Math.floor(maxMachinesPerFloor))
    : 50;

  const selectedLayout = LAYOUT_PRESETS.find((layout) => layout.id === layoutStyle) ?? LAYOUT_PRESETS[1];

  const plan = useMemo(
    () => computeProductionPlan(itemId, targetRatePerMin),
    [itemId, targetRatePerMin],
  );

  const buildingRows = useMemo(
    () => adjustBuildingsForClockSpeed(plan.buildingBreakdown, safeClock),
    [plan.buildingBreakdown, safeClock],
  );

  const totalMachines = buildingRows.reduce((sum, row) => sum + row.adjustedMachines, 0);
  const coreArea = buildingRows.reduce((sum, row) => sum + row.adjustedMachines * row.footprintM2, 0);
  const plannedArea = coreArea * selectedLayout.spacingFactor;
  const busBaselineArea = coreArea * 1.35;
  const areaSavingsVsBus = busBaselineArea - plannedArea;

  const floorsByArea = Math.max(1, Math.ceil(plannedArea / safeFloorArea));
  const floorsByMachineDensity = Math.max(1, Math.ceil(totalMachines / safeMaxMachinesPerFloor));
  const recommendedFloors = Math.max(floorsByArea, floorsByMachineDensity);
  const averageAreaPerFloor = plannedArea / recommendedFloors;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-950/70 to-zinc-950/30 p-5 sm:p-6">
      <h2 className="text-xl font-semibold tracking-tight">Building Planner</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        Convert production goals into practical factory layout requirements with floor count,
        machine distribution, and space-optimization guidance.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
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
            value={safeClock}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              setMachineClockPercent(Number.isFinite(parsed) ? parsed : 100);
            }}
            className="mt-3 w-full rounded-lg border border-zinc-800 bg-[#0a0a0a] px-3 py-2 font-mono text-zinc-100 outline-none focus:border-emerald-500/60"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {EXAMPLE_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setItemId(preset.itemId);
              setTargetRatePerMin(preset.rate);
              setLayoutStyle(preset.style);
            }}
            className="rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-mono text-zinc-200 hover:border-zinc-700"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">Layout profile</h3>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          {LAYOUT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setLayoutStyle(preset.id)}
              className={`rounded-lg border p-4 text-left transition-colors ${
                preset.id === layoutStyle
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : "border-zinc-800 bg-[#0a0a0a] hover:border-zinc-700"
              }`}
            >
              <div className="text-sm font-semibold text-zinc-100">{preset.name}</div>
              <div className="mt-2 text-xs text-zinc-400">Spacing factor: {preset.spacingFactor}x</div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">{preset.logisticsNote}</p>
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="rounded-lg border border-zinc-800 bg-[#0a0a0a] p-3">
            <span className="text-xs text-zinc-500">Usable area per floor (m²)</span>
            <input
              type="number"
              min={100}
              step={50}
              value={safeFloorArea}
              onChange={(event) => {
                const parsed = Number(event.target.value);
                setAreaPerFloorM2(Number.isFinite(parsed) ? parsed : 2200);
              }}
              className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 font-mono text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
            />
          </label>

          <label className="rounded-lg border border-zinc-800 bg-[#0a0a0a] p-3">
            <span className="text-xs text-zinc-500">Max machines per floor</span>
            <input
              type="number"
              min={5}
              step={1}
              value={safeMaxMachinesPerFloor}
              onChange={(event) => {
                const parsed = Number(event.target.value);
                setMaxMachinesPerFloor(Number.isFinite(parsed) ? parsed : 50);
              }}
              className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 font-mono text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
            />
          </label>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total machines" value={formatNumber(totalMachines)} />
        <MetricCard label="Core machine area" value={`${formatNumber(coreArea, 0)} m²`} />
        <MetricCard label="Planned area" value={`${formatNumber(plannedArea, 0)} m²`} />
        <MetricCard label="Recommended floors" value={formatNumber(recommendedFloors, 0)} />
      </div>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-300">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
          Space optimization summary
        </h3>
        <p className="mt-2 leading-relaxed">
          Selected style: <span className="font-semibold text-zinc-100">{selectedLayout.name}</span>.{
          " "}
          {selectedLayout.recommendation}
        </p>
        <p className="mt-2 leading-relaxed">
          With {formatNumber(safeFloorArea, 0)} m² per floor, plan for at least
          {" "}
          <span className="font-semibold text-zinc-100">{recommendedFloors}</span> floor(s), averaging
          {" "}
          <span className="font-semibold text-zinc-100">
            {formatNumber(averageAreaPerFloor, 0)} m²
          </span>
          {" "}
          each.
        </p>
        <p className="mt-2 leading-relaxed">
          Space delta vs a Main Bus baseline: {" "}
          <span
            className={`font-semibold ${
              areaSavingsVsBus >= 0 ? "text-emerald-300" : "text-amber-300"
            }`}
          >
            {areaSavingsVsBus >= 0 ? "+" : ""}
            {formatNumber(areaSavingsVsBus, 0)} m²
          </span>
          .
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
          Building quantity calculation
        </h3>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-y border-zinc-800 text-left text-xs uppercase tracking-wide text-zinc-400">
                <th className="px-3 py-2">Building</th>
                <th className="px-3 py-2">Machines @ {safeClock}%</th>
                <th className="px-3 py-2">Area</th>
                <th className="px-3 py-2">Area with spacing</th>
              </tr>
            </thead>
            <tbody>
              {buildingRows.map((row) => {
                const area = row.adjustedMachines * row.footprintM2;
                const spacedArea = area * selectedLayout.spacingFactor;
                return (
                  <tr key={row.buildingId} className="border-b border-zinc-900/80 text-zinc-300">
                    <td className="px-3 py-2">{row.buildingName}</td>
                    <td className="px-3 py-2 font-mono">{formatNumber(row.adjustedMachines)}</td>
                    <td className="px-3 py-2 font-mono">{formatNumber(area, 0)} m²</td>
                    <td className="px-3 py-2 font-mono">{formatNumber(spacedArea, 0)} m²</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
