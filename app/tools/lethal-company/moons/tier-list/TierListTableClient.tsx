"use client";

import { useMemo, useState } from "react";

export type TierRow = {
  moon: string;
  tier: "S" | "A" | "B" | "C";
  risk: "Low" | "Medium" | "High" | "Very High";
  expectedLoot: string;
  expectedLootValue: number;
  recommendedTeamSize: string;
  teamSizeMin: number;
  notes: string;
  estimated: boolean;
};

type SortKey = "moon" | "tier" | "risk" | "expectedLoot" | "recommendedTeamSize";
type SortDirection = "asc" | "desc";

const TIER_ORDER: Record<TierRow["tier"], number> = { S: 1, A: 2, B: 3, C: 4 };
const RISK_ORDER: Record<TierRow["risk"], number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  "Very High": 4,
};

export default function TierListTableClient({ rows }: { rows: TierRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("tier");
  const [direction, setDirection] = useState<SortDirection>("asc");

  function toggleSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextKey);
    setDirection("asc");
  }

  const sortedRows = useMemo(() => {
    const next = [...rows];
    next.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "moon") cmp = a.moon.localeCompare(b.moon);
      if (sortKey === "tier") cmp = TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
      if (sortKey === "risk") cmp = RISK_ORDER[a.risk] - RISK_ORDER[b.risk];
      if (sortKey === "expectedLoot") cmp = a.expectedLootValue - b.expectedLootValue;
      if (sortKey === "recommendedTeamSize") cmp = a.teamSizeMin - b.teamSizeMin;
      return direction === "asc" ? cmp : -cmp;
    });
    return next;
  }, [direction, rows, sortKey]);

  function sortLabel(key: SortKey) {
    if (sortKey !== key) return "";
    return direction === "asc" ? "↑" : "↓";
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Moons Tier Table</h2>
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-200">
          Values marked as estimates
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-950/70 text-left text-xs font-mono uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="px-4 py-3">
                <SortButton label={`Moon ${sortLabel("moon")}`} onClick={() => toggleSort("moon")} />
              </th>
              <th className="px-4 py-3">
                <SortButton label={`Tier ${sortLabel("tier")}`} onClick={() => toggleSort("tier")} />
              </th>
              <th className="px-4 py-3">
                <SortButton label={`Risk ${sortLabel("risk")}`} onClick={() => toggleSort("risk")} />
              </th>
              <th className="px-4 py-3">
                <SortButton
                  label={`Expected Loot ${sortLabel("expectedLoot")}`}
                  onClick={() => toggleSort("expectedLoot")}
                />
              </th>
              <th className="px-4 py-3">
                <SortButton
                  label={`Recommended Team Size ${sortLabel("recommendedTeamSize")}`}
                  onClick={() => toggleSort("recommendedTeamSize")}
                />
              </th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.moon} className="border-b border-zinc-800/80 align-top last:border-b-0">
                <td className="px-4 py-3 font-medium text-zinc-100">{row.moon}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-mono text-zinc-200">
                    {row.tier}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-300">{row.risk}</td>
                <td className="px-4 py-3 text-zinc-300">{row.expectedLoot}</td>
                <td className="px-4 py-3 text-zinc-300">{row.recommendedTeamSize}</td>
                <td className="px-4 py-3 text-zinc-400">
                  {row.notes}{" "}
                  {row.estimated ? (
                    <span className="text-amber-300/90">(Estimate, unverified)</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SortButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-left text-zinc-300 transition-colors hover:text-zinc-100"
    >
      {label}
    </button>
  );
}
