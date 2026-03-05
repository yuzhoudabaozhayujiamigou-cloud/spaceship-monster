"use client";

import { useMemo, useState } from "react";

export type BreedingCombo = {
  id: string;
  parentA: string;
  parentB: string;
  child: string;
  element: string;
  tier: "Starter" | "Mid" | "Late";
  note: string;
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export default function BreedingCalculatorClient({
  combos,
}: {
  combos: BreedingCombo[];
}) {
  const [query, setQuery] = useState("");
  const [element, setElement] = useState("All");
  const [tier, setTier] = useState<"All" | "Starter" | "Mid" | "Late">("All");

  const elements = useMemo(
    () => ["All", ...new Set(combos.map((combo) => combo.element))],
    [combos],
  );

  const filtered = useMemo(() => {
    const q = normalize(query);
    return combos.filter((combo) => {
      if (element !== "All" && combo.element !== element) return false;
      if (tier !== "All" && combo.tier !== tier) return false;
      if (!q) return true;
      const text = normalize(
        `${combo.parentA} ${combo.parentB} ${combo.child} ${combo.element} ${combo.note}`,
      );
      return text.includes(q);
    });
  }, [combos, element, query, tier]);

  return (
    <>
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="text-xs font-mono text-zinc-500">search</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search parent, child, element, or notes..."
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <div className="text-xs font-mono text-zinc-500">element</div>
            <select
              value={element}
              onChange={(e) => setElement(e.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-3 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            >
              {elements.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs font-mono text-zinc-500">tier</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["All", "Starter", "Mid", "Late"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTier(option)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  tier === option
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                    : "border-zinc-800 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-950/60"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">Breeding Combos</h2>
          <span className="text-xs text-zinc-500">{filtered.length} results</span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 text-sm text-zinc-400">
            No combos found with current filters.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/40">
            <table className="min-w-full text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-950/70">
                <tr className="text-left text-xs font-mono uppercase tracking-wider text-zinc-400">
                  <th className="px-4 py-3">Parent A</th>
                  <th className="px-4 py-3">Parent B</th>
                  <th className="px-4 py-3">Child</th>
                  <th className="px-4 py-3">Element</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((combo) => (
                  <tr
                    key={combo.id}
                    id={combo.id}
                    className="border-b border-zinc-800/80 last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-100">{combo.parentA}</td>
                    <td className="px-4 py-3 font-medium text-zinc-100">{combo.parentB}</td>
                    <td className="px-4 py-3 text-emerald-300">{combo.child}</td>
                    <td className="px-4 py-3 text-zinc-300">{combo.element}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-mono text-zinc-300">
                        {combo.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{combo.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
