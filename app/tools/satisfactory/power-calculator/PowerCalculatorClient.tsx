"use client";

import { useMemo, useState } from "react";

import {
  BUILDINGS,
  GENERATORS,
  type BuildingId,
  type GeneratorId,
} from "../_data/satisfactory";
import { clampClock } from "../_lib/production";

const PLANNED_BUILDINGS: BuildingId[] = [
  "miner",
  "water-extractor",
  "oil-extractor",
  "smelter",
  "constructor",
  "foundry",
  "assembler",
  "manufacturer",
  "refinery",
  "blender",
];

const INITIAL_COUNTS: Record<BuildingId, number> = {
  miner: 8,
  "water-extractor": 4,
  "oil-extractor": 2,
  smelter: 12,
  constructor: 20,
  foundry: 8,
  assembler: 10,
  manufacturer: 4,
  refinery: 8,
  blender: 2,
};

const PRESETS = [
  {
    label: "Starter (Coal)",
    counts: {
      miner: 6,
      "water-extractor": 3,
      "oil-extractor": 0,
      smelter: 10,
      constructor: 14,
      foundry: 4,
      assembler: 4,
      manufacturer: 0,
      refinery: 0,
      blender: 0,
    } as Record<BuildingId, number>,
    clock: 100,
    reserve: 20,
    generator: "coal" as GeneratorId,
  },
  {
    label: "Mid Game (Fuel)",
    counts: {
      miner: 12,
      "water-extractor": 6,
      "oil-extractor": 5,
      smelter: 20,
      constructor: 34,
      foundry: 14,
      assembler: 20,
      manufacturer: 8,
      refinery: 24,
      blender: 4,
    } as Record<BuildingId, number>,
    clock: 120,
    reserve: 25,
    generator: "fuel" as GeneratorId,
  },
  {
    label: "Late Game (Nuclear)",
    counts: {
      miner: 20,
      "water-extractor": 12,
      "oil-extractor": 8,
      smelter: 28,
      constructor: 48,
      foundry: 26,
      assembler: 34,
      manufacturer: 20,
      refinery: 36,
      blender: 18,
    } as Record<BuildingId, number>,
    clock: 150,
    reserve: 30,
    generator: "nuclear" as GeneratorId,
  },
];

function formatNumber(value: number, decimals = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

function normalizeCount(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}

export default function PowerCalculatorClient() {
  const [machineCounts, setMachineCounts] = useState<Record<BuildingId, number>>(INITIAL_COUNTS);
  const [machineClockPercent, setMachineClockPercent] = useState(100);
  const [reservePercent, setReservePercent] = useState(20);
  const [preferredGeneratorId, setPreferredGeneratorId] = useState<GeneratorId>("coal");

  const safeClock = clampClock(machineClockPercent);
  const clockFactor = safeClock / 100;
  const safeReserve = Number.isFinite(reservePercent)
    ? Math.min(150, Math.max(0, reservePercent))
    : 20;

  const machineRows = useMemo(() => {
    return PLANNED_BUILDINGS.map((buildingId) => {
      const building = BUILDINGS[buildingId];
      const count = normalizeCount(machineCounts[buildingId] ?? 0);
      const powerPerMachine = building.basePowerMW * Math.pow(clockFactor, 1.6);
      const totalPower = count * powerPerMachine;

      return {
        buildingId,
        buildingName: building.name,
        count,
        powerPerMachine,
        totalPower,
      };
    });
  }, [clockFactor, machineCounts]);

  const totalDemandMW = machineRows.reduce((sum, row) => sum + row.totalPower, 0);
  const targetCapacityMW = totalDemandMW * (1 + safeReserve / 100);

  const generatorRows = useMemo(() => {
    return GENERATORS.map((generator) => {
      const requiredUnits = targetCapacityMW <= 0 ? 0 : Math.ceil(targetCapacityMW / generator.outputMW);
      const providedMW = requiredUnits * generator.outputMW;

      return {
        ...generator,
        requiredUnits,
        providedMW,
        fuelPerMinTotal: requiredUnits * generator.fuelPerMin,
        waterPerMinTotal:
          generator.waterPerMin === undefined ? null : requiredUnits * generator.waterPerMin,
      };
    });
  }, [targetCapacityMW]);

  const preferredPlan =
    generatorRows.find((row) => row.id === preferredGeneratorId) ?? generatorRows[0] ?? null;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-950/70 to-zinc-950/30 p-5 sm:p-6">
      <h2 className="text-xl font-semibold tracking-tight">Power Calculator</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        Estimate factory demand in MW, include reserve margin, and pick a generator strategy with
        fuel consumption numbers.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
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

        <label className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <span className="text-sm font-medium text-zinc-200">Reserve margin (%)</span>
          <input
            type="number"
            min={0}
            max={150}
            value={safeReserve}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              setReservePercent(Number.isFinite(parsed) ? parsed : 20);
            }}
            className="mt-3 w-full rounded-lg border border-zinc-800 bg-[#0a0a0a] px-3 py-2 font-mono text-zinc-100 outline-none focus:border-emerald-500/60"
          />
          <p className="mt-2 text-xs text-zinc-500">Adds planning headroom for spikes and expansion.</p>
        </label>

        <label className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <span className="text-sm font-medium text-zinc-200">Preferred generator</span>
          <select
            value={preferredGeneratorId}
            onChange={(event) => setPreferredGeneratorId(event.target.value as GeneratorId)}
            className="mt-3 w-full rounded-lg border border-zinc-800 bg-[#0a0a0a] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
          >
            {GENERATORS.map((generator) => (
              <option key={generator.id} value={generator.id}>
                {generator.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setMachineCounts(preset.counts);
              setMachineClockPercent(preset.clock);
              setReservePercent(preset.reserve);
              setPreferredGeneratorId(preset.generator);
            }}
            className="rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-mono text-zinc-200 hover:border-zinc-700"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Factory demand" value={`${formatNumber(totalDemandMW)} MW`} />
        <MetricCard label="Target capacity" value={`${formatNumber(targetCapacityMW)} MW`} />
        <MetricCard label="Reserve margin" value={`${formatNumber(safeReserve)}%`} />
      </div>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
          Building power demand
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-y border-zinc-800 text-left text-xs uppercase tracking-wide text-zinc-400">
                <th className="px-3 py-2">Building</th>
                <th className="px-3 py-2">Count</th>
                <th className="px-3 py-2">MW / Building</th>
                <th className="px-3 py-2">Total MW</th>
              </tr>
            </thead>
            <tbody>
              {machineRows.map((row) => (
                <tr key={row.buildingId} className="border-b border-zinc-900/80 text-zinc-300">
                  <td className="px-3 py-2">{row.buildingName}</td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={row.count}
                      onChange={(event) => {
                        const parsed = Number(event.target.value);
                        const nextValue = normalizeCount(parsed);
                        setMachineCounts((previous) => ({
                          ...previous,
                          [row.buildingId]: nextValue,
                        }));
                      }}
                      className="w-24 rounded border border-zinc-800 bg-[#0a0a0a] px-2 py-1 font-mono text-zinc-100 outline-none focus:border-emerald-500/60"
                    />
                  </td>
                  <td className="px-3 py-2 font-mono">{formatNumber(row.powerPerMachine)} MW</td>
                  <td className="px-3 py-2 font-mono">{formatNumber(row.totalPower)} MW</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
          Generator configuration suggestions
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-y border-zinc-800 text-left text-xs uppercase tracking-wide text-zinc-400">
                <th className="px-3 py-2">Generator</th>
                <th className="px-3 py-2">Required Units</th>
                <th className="px-3 py-2">Provided MW</th>
                <th className="px-3 py-2">Fuel / min</th>
                <th className="px-3 py-2">Water / min</th>
              </tr>
            </thead>
            <tbody>
              {generatorRows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-zinc-900/80 ${
                    row.id === preferredGeneratorId
                      ? "bg-emerald-500/10 text-emerald-100"
                      : "text-zinc-300"
                  }`}
                >
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2 font-mono">{formatNumber(row.requiredUnits, 0)}</td>
                  <td className="px-3 py-2 font-mono">{formatNumber(row.providedMW)} MW</td>
                  <td className="px-3 py-2 font-mono">
                    {formatNumber(row.fuelPerMinTotal)} {row.fuelLabel}/min
                  </td>
                  <td className="px-3 py-2 font-mono">
                    {row.waterPerMinTotal === null ? "-" : `${formatNumber(row.waterPerMinTotal)} m³/min`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {preferredPlan ? (
        <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-300">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
            Preferred configuration summary
          </h3>
          <p className="mt-2 leading-relaxed">
            {preferredPlan.requiredUnits} {preferredPlan.name}
            {preferredPlan.requiredUnits === 1 ? " is" : " are"} needed to cover
            {" "}
            {formatNumber(targetCapacityMW)} MW. Estimated fuel draw is
            {" "}
            {formatNumber(preferredPlan.fuelPerMinTotal)} {preferredPlan.fuelLabel}/min
            {preferredPlan.waterPerMinTotal === null
              ? "."
              : ` and ${formatNumber(preferredPlan.waterPerMinTotal)} m³/min of water.`}
          </p>
        </section>
      ) : null}
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
