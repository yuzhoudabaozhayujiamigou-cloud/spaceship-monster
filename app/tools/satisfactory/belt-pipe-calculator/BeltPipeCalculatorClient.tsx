"use client";

import { useMemo, useState } from "react";

import { BELT_TIERS, PIPE_TIERS } from "../_data/satisfactory";

type TransportMode = "belt" | "pipe";

function formatNumber(value: number, decimals = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

function clampNonNegative(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
}

function clampWhole(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.floor(value));
}

export default function BeltPipeCalculatorClient() {
  const [beltRate, setBeltRate] = useState(780);
  const [beltLines, setBeltLines] = useState(1);
  const [selectedBeltTierId, setSelectedBeltTierId] = useState("mk5");

  const [pipeRate, setPipeRate] = useState(450);
  const [pipeLines, setPipeLines] = useState(1);
  const [selectedPipeTierId, setSelectedPipeTierId] = useState("mk2");

  const [analysisMode, setAnalysisMode] = useState<TransportMode>("belt");
  const [sourceRate, setSourceRate] = useState(960);
  const [demandRate, setDemandRate] = useState(780);
  const [analysisLines, setAnalysisLines] = useState(2);
  const [analysisTierId, setAnalysisTierId] = useState("mk5");

  const selectedBeltTier = BELT_TIERS.find((tier) => tier.id === selectedBeltTierId) ?? BELT_TIERS[0];
  const selectedPipeTier = PIPE_TIERS.find((tier) => tier.id === selectedPipeTierId) ?? PIPE_TIERS[0];

  const beltResult = useMemo(() => {
    const rate = clampNonNegative(beltRate);
    const lanes = clampWhole(beltLines);
    const capacity = selectedBeltTier.capacity * lanes;
    const utilization = capacity === 0 ? 0 : (rate / capacity) * 100;
    const bottleneck = utilization > 100;
    const bestTier = BELT_TIERS.find((tier) => tier.capacity * lanes >= rate) ?? null;

    return {
      rate,
      lanes,
      capacity,
      utilization,
      bottleneck,
      bestTier,
      requiredLinesOnSelectedTier:
        selectedBeltTier.capacity > 0 ? Math.ceil(rate / selectedBeltTier.capacity) : 0,
    };
  }, [beltLines, beltRate, selectedBeltTier]);

  const pipeResult = useMemo(() => {
    const rate = clampNonNegative(pipeRate);
    const lines = clampWhole(pipeLines);
    const capacity = selectedPipeTier.capacity * lines;
    const utilization = capacity === 0 ? 0 : (rate / capacity) * 100;
    const bottleneck = utilization > 100;
    const bestTier = PIPE_TIERS.find((tier) => tier.capacity * lines >= rate) ?? null;

    return {
      rate,
      lines,
      capacity,
      utilization,
      bottleneck,
      bestTier,
      requiredLinesOnSelectedTier:
        selectedPipeTier.capacity > 0 ? Math.ceil(rate / selectedPipeTier.capacity) : 0,
    };
  }, [pipeLines, pipeRate, selectedPipeTier]);

  const analysisCapacityLookup = analysisMode === "belt" ? BELT_TIERS : PIPE_TIERS;
  const selectedAnalysisTier =
    analysisCapacityLookup.find((tier) => tier.id === analysisTierId) ?? analysisCapacityLookup[0];

  const bottleneckAnalysis = useMemo(() => {
    const source = clampNonNegative(sourceRate);
    const demand = clampNonNegative(demandRate);
    const lines = clampWhole(analysisLines);
    const transportCapacity = selectedAnalysisTier.capacity * lines;

    const effectiveThroughput = Math.min(source, demand, transportCapacity);

    const constraints = [
      {
        key: "source",
        label: "Source supply",
        value: source,
      },
      {
        key: "transport",
        label: `${analysisMode === "belt" ? "Belt" : "Pipe"} network`,
        value: transportCapacity,
      },
      {
        key: "demand",
        label: "Consumer demand",
        value: demand,
      },
    ];

    const EPSILON = 0.0001;
    const limiting = constraints.filter(
      (constraint) => Math.abs(constraint.value - effectiveThroughput) <= EPSILON,
    );

    return {
      source,
      demand,
      lines,
      transportCapacity,
      effectiveThroughput,
      limiting,
      unmetDemand: Math.max(demand - effectiveThroughput, 0),
      unusedSupply: Math.max(source - effectiveThroughput, 0),
      unusedTransport: Math.max(transportCapacity - effectiveThroughput, 0),
    };
  }, [analysisLines, analysisMode, demandRate, selectedAnalysisTier, sourceRate]);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-950/70 to-zinc-950/30 p-5 sm:p-6">
      <h2 className="text-xl font-semibold tracking-tight">Belt/Pipe Calculator</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        Match transport capacity to throughput targets and identify where your line is actually
        constrained.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
            Conveyor belt throughput
          </h3>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <InputField
              label="Required items/min"
              value={beltRate}
              step={1}
              onChange={setBeltRate}
            />
            <InputField label="Belt lines" value={beltLines} step={1} onChange={setBeltLines} />
            <label className="rounded-lg border border-zinc-800 bg-[#0a0a0a] p-3">
              <span className="text-xs text-zinc-500">Selected tier</span>
              <select
                value={selectedBeltTierId}
                onChange={(event) => setSelectedBeltTierId(event.target.value)}
                className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
              >
                {BELT_TIERS.map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.name} ({tier.capacity}/min)
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ResultCard label="Line capacity" value={`${formatNumber(beltResult.capacity)} items/min`} />
            <ResultCard label="Utilization" value={`${formatNumber(beltResult.utilization)}%`} />
            <ResultCard
              label="Bottleneck"
              value={beltResult.bottleneck ? "Yes (add capacity)" : "No"}
            />
            <ResultCard
              label="Auto tier suggestion"
              value={beltResult.bestTier ? beltResult.bestTier.name : "Add more lines"}
            />
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            Required lines on selected tier: {formatNumber(beltResult.requiredLinesOnSelectedTier, 0)}
          </p>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
            Pipeline flow calculation
          </h3>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <InputField
              label="Required m³/min"
              value={pipeRate}
              step={1}
              onChange={setPipeRate}
            />
            <InputField label="Pipe lines" value={pipeLines} step={1} onChange={setPipeLines} />
            <label className="rounded-lg border border-zinc-800 bg-[#0a0a0a] p-3">
              <span className="text-xs text-zinc-500">Selected tier</span>
              <select
                value={selectedPipeTierId}
                onChange={(event) => setSelectedPipeTierId(event.target.value)}
                className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
              >
                {PIPE_TIERS.map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.name} ({tier.capacity} m³/min)
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ResultCard label="Line capacity" value={`${formatNumber(pipeResult.capacity)} m³/min`} />
            <ResultCard label="Utilization" value={`${formatNumber(pipeResult.utilization)}%`} />
            <ResultCard
              label="Bottleneck"
              value={pipeResult.bottleneck ? "Yes (add capacity)" : "No"}
            />
            <ResultCard
              label="Auto tier suggestion"
              value={pipeResult.bestTier ? pipeResult.bestTier.name : "Add more lines"}
            />
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            Required lines on selected tier: {formatNumber(pipeResult.requiredLinesOnSelectedTier, 0)}
          </p>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
          Bottleneck analysis
        </h3>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-5">
          <label className="rounded-lg border border-zinc-800 bg-[#0a0a0a] p-3">
            <span className="text-xs text-zinc-500">Mode</span>
            <select
              value={analysisMode}
              onChange={(event) => {
                const nextMode = event.target.value as TransportMode;
                setAnalysisMode(nextMode);
                setAnalysisTierId(nextMode === "belt" ? "mk5" : "mk2");
              }}
              className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
            >
              <option value="belt">Belt</option>
              <option value="pipe">Pipe</option>
            </select>
          </label>

          <InputField
            label="Source rate"
            value={sourceRate}
            step={1}
            onChange={setSourceRate}
          />

          <InputField
            label="Demand rate"
            value={demandRate}
            step={1}
            onChange={setDemandRate}
          />

          <InputField
            label={`${analysisMode === "belt" ? "Belts" : "Pipes"}`}
            value={analysisLines}
            step={1}
            onChange={setAnalysisLines}
          />

          <label className="rounded-lg border border-zinc-800 bg-[#0a0a0a] p-3">
            <span className="text-xs text-zinc-500">Transport tier</span>
            <select
              value={analysisTierId}
              onChange={(event) => setAnalysisTierId(event.target.value)}
              className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
            >
              {analysisCapacityLookup.map((tier) => (
                <option key={tier.id} value={tier.id}>
                  {tier.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <ResultCard
            label="Effective throughput"
            value={`${formatNumber(bottleneckAnalysis.effectiveThroughput)} / min`}
          />
          <ResultCard
            label="Transport capacity"
            value={`${formatNumber(bottleneckAnalysis.transportCapacity)} / min`}
          />
          <ResultCard
            label="Unmet demand"
            value={`${formatNumber(bottleneckAnalysis.unmetDemand)} / min`}
          />
          <ResultCard
            label="Unused supply"
            value={`${formatNumber(bottleneckAnalysis.unusedSupply)} / min`}
          />
          <ResultCard
            label="Unused transport"
            value={`${formatNumber(bottleneckAnalysis.unusedTransport)} / min`}
          />
        </div>

        <div className="mt-4 rounded-lg border border-zinc-800 bg-[#0a0a0a] p-4 text-sm text-zinc-300">
          <span className="font-semibold text-zinc-100">Limiting stage: </span>
          {bottleneckAnalysis.limiting.map((item) => item.label).join(" + ")}
          .
        </div>
      </section>
    </section>
  );
}

function InputField({
  label,
  value,
  step,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="rounded-lg border border-zinc-800 bg-[#0a0a0a] p-3">
      <span className="text-xs text-zinc-500">{label}</span>
      <input
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          onChange(Number.isFinite(parsed) ? Math.max(0, parsed) : 0);
        }}
        className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 font-mono text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
      />
    </label>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-[#0a0a0a] p-3">
      <div className="text-xs font-mono text-zinc-500">{label}</div>
      <div className="mt-2 text-base font-mono text-zinc-100">{value}</div>
    </div>
  );
}
