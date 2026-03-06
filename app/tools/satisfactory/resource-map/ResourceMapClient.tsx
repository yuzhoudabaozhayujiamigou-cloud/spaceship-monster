"use client";

import { useMemo, useState } from "react";

import { RESOURCE_NODES, type NodePurity } from "../_data/satisfactory";

type SortMode = "score" | "purity" | "region";


const PURITY_WEIGHT: Record<NodePurity, number> = {
  Impure: 0.5,
  Normal: 1,
  Pure: 2,
};

const PURITY_COLOR: Record<NodePurity, string> = {
  Impure: "bg-amber-400",
  Normal: "bg-sky-400",
  Pure: "bg-emerald-400",
};

function formatNumber(value: number, decimals = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

function scoreNode(node: (typeof RESOURCE_NODES)[number]) {
  const purityScore = PURITY_WEIGHT[node.purity] * 2.2;
  const diversityScore = Math.min(node.nearby.length, 4) * 0.45;
  const waterBonus = node.nearby.includes("Water") ? 0.7 : 0;
  const coalBonus = node.nearby.includes("Coal") ? 0.45 : 0;
  const oilBonus = node.nearby.includes("Crude Oil") ? 0.45 : 0;

  return purityScore + diversityScore + waterBonus + coalBonus + oilBonus;
}

export default function ResourceMapClient() {
  const [resourceFilter, setResourceFilter] = useState("All resources");
  const [purityFilter, setPurityFilter] = useState<"All" | NodePurity>("All");
  const [regionFilter, setRegionFilter] = useState("All regions");
  const [sortMode, setSortMode] = useState<SortMode>("score");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const resources = useMemo(() => {
    return ["All resources", ...Array.from(new Set(RESOURCE_NODES.map((node) => node.resource))).sort()];
  }, []);

  const regions = useMemo(() => {
    return ["All regions", ...Array.from(new Set(RESOURCE_NODES.map((node) => node.region))).sort()];
  }, []);

  const filteredNodes = useMemo(() => {
    let nodes = RESOURCE_NODES.map((node) => ({
      ...node,
      score: scoreNode(node),
    }));

    nodes = nodes.filter((node) => {
      if (resourceFilter !== "All resources" && node.resource !== resourceFilter) {
        return false;
      }
      if (purityFilter !== "All" && node.purity !== purityFilter) {
        return false;
      }
      if (regionFilter !== "All regions" && node.region !== regionFilter) {
        return false;
      }
      return true;
    });

    if (sortMode === "score") {
      nodes.sort((left, right) => right.score - left.score);
    } else if (sortMode === "purity") {
      nodes.sort(
        (left, right) => PURITY_WEIGHT[right.purity] - PURITY_WEIGHT[left.purity] || right.score - left.score,
      );
    } else {
      nodes.sort((left, right) => left.region.localeCompare(right.region) || right.score - left.score);
    }

    return nodes;
  }, [purityFilter, regionFilter, resourceFilter, sortMode]);

  const recommendedNodes = filteredNodes.slice(0, 5);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) {
      return recommendedNodes[0] ?? null;
    }
    return filteredNodes.find((node) => node.id === selectedNodeId) ?? recommendedNodes[0] ?? null;
  }, [filteredNodes, recommendedNodes, selectedNodeId]);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-950/70 to-zinc-950/30 p-5 sm:p-6">
      <h2 className="text-xl font-semibold tracking-tight">Resource Map</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        Filter resource nodes by type, purity, and region. Use node score and nearby resource mix to
        pick better long-term extraction hubs.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        <SelectField
          label="Resource"
          value={resourceFilter}
          onChange={setResourceFilter}
          options={resources}
        />

        <SelectField
          label="Purity"
          value={purityFilter}
          onChange={(value) => setPurityFilter(value as "All" | NodePurity)}
          options={["All", "Pure", "Normal", "Impure"]}
        />

        <SelectField
          label="Region"
          value={regionFilter}
          onChange={setRegionFilter}
          options={regions}
        />

        <SelectField
          label="Sort"
          value={sortMode}
          onChange={(value) => setSortMode(value as SortMode)}
          options={["score", "purity", "region"]}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 xl:col-span-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
            Node map view
          </h3>
          <div className="relative mt-3 h-[360px] overflow-hidden rounded-lg border border-zinc-800 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.08),transparent_42%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.07),transparent_38%),linear-gradient(180deg,#0a0a0a,#0d1117)]">
            {filteredNodes.map((node) => {
              const selected = selectedNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border ${
                    selected ? "border-white scale-125" : "border-zinc-900"
                  } ${PURITY_COLOR[node.purity]}`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  aria-label={`${node.resource} ${node.purity} in ${node.region}`}
                />
              );
            })}

            <div className="absolute bottom-3 left-3 rounded-md border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-400">
              {filteredNodes.length} nodes shown
            </div>
          </div>

          {selectedNode ? (
            <div className="mt-4 rounded-lg border border-zinc-800 bg-[#0a0a0a] p-4 text-sm text-zinc-300">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-semibold text-zinc-100">{selectedNode.resource}</span>
                <span
                  className={`rounded-full border border-zinc-700 px-2 py-0.5 text-xs ${
                    selectedNode.purity === "Pure"
                      ? "text-emerald-300"
                      : selectedNode.purity === "Normal"
                        ? "text-sky-300"
                        : "text-amber-300"
                  }`}
                >
                  {selectedNode.purity}
                </span>
                <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-300">
                  Score {formatNumber(selectedNode.score)}
                </span>
              </div>
              <p className="mt-2 text-zinc-400">{selectedNode.region}</p>
              <p className="mt-2 leading-relaxed">{selectedNode.notes}</p>
              <p className="mt-2 text-xs text-zinc-500">
                Nearby: {selectedNode.nearby.length > 0 ? selectedNode.nearby.join(", ") : "No nearby data"}
              </p>
            </div>
          ) : null}
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 xl:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
            Optimal gathering points
          </h3>
          <p className="mt-2 text-xs text-zinc-500">
            Top candidates by purity and logistics synergy under current filters.
          </p>

          <div className="mt-3 space-y-3">
            {recommendedNodes.map((node, index) => (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedNodeId(node.id)}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  selectedNode?.id === node.id
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : "border-zinc-800 bg-[#0a0a0a] hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-zinc-100">
                    #{index + 1} {node.resource}
                  </div>
                  <div className="text-xs font-mono text-zinc-300">Score {formatNumber(node.score)}</div>
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  {node.purity} · {node.region}
                </p>
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">
          Node table
        </h3>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="border-y border-zinc-800 text-left text-xs uppercase tracking-wide text-zinc-400">
                <th className="px-3 py-2">Resource</th>
                <th className="px-3 py-2">Purity</th>
                <th className="px-3 py-2">Region</th>
                <th className="px-3 py-2">Coordinates</th>
                <th className="px-3 py-2">Nearby</th>
                <th className="px-3 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredNodes.map((node) => (
                <tr
                  key={node.id}
                  className={`border-b border-zinc-900/80 text-zinc-300 ${
                    selectedNode?.id === node.id ? "bg-emerald-500/10" : ""
                  }`}
                >
                  <td className="px-3 py-2">{node.resource}</td>
                  <td className="px-3 py-2">{node.purity}</td>
                  <td className="px-3 py-2">{node.region}</td>
                  <td className="px-3 py-2 font-mono">({node.x}, {node.y})</td>
                  <td className="px-3 py-2">{node.nearby.join(", ")}</td>
                  <td className="px-3 py-2 font-mono">{formatNumber(node.score)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="rounded-lg border border-zinc-800 bg-[#0a0a0a] p-3">
      <span className="text-xs text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
