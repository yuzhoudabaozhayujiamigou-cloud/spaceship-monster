"use client";

import { useMemo, useState } from "react";

export type PaldeckEntry = {
  id: string;
  name: string;
  element: string;
  workSuitabilities: string[];
  partnerSkill: string;
  tier: "Starter" | "Mid" | "Late";
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export default function PaldeckClient({ entries }: { entries: PaldeckEntry[] }) {
  const [query, setQuery] = useState("");
  const [element, setElement] = useState("All");
  const [workSuitability, setWorkSuitability] = useState("All");

  const elements = useMemo(
    () => ["All", ...new Set(entries.map((entry) => entry.element))],
    [entries],
  );

  const workSuitabilities = useMemo(
    () => ["All", ...new Set(entries.flatMap((entry) => entry.workSuitabilities))],
    [entries],
  );

  const filtered = useMemo(() => {
    const q = normalize(query);
    return entries.filter((entry) => {
      if (element !== "All" && entry.element !== element) return false;
      if (
        workSuitability !== "All" &&
        !entry.workSuitabilities.includes(workSuitability)
      ) {
        return false;
      }
      if (!q) return true;
      const haystack = normalize(
        `${entry.name} ${entry.element} ${entry.partnerSkill} ${entry.tier} ${entry.workSuitabilities.join(" ")}`,
      );
      return haystack.includes(q);
    });
  }, [element, entries, query, workSuitability]);

  return (
    <>
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="text-xs font-mono text-zinc-500">search</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by pal name, element, skill, or role..."
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
          <div className="text-xs font-mono text-zinc-500">work suitability</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {workSuitabilities.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setWorkSuitability(option)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  workSuitability === option
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
          <h2 className="text-xl font-semibold">Paldeck List</h2>
          <span className="text-xs text-zinc-500">{filtered.length} results</span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 text-sm text-zinc-400">
            No pals matched your current search and filters.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/40">
            <table className="min-w-full text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-950/70">
                <tr className="text-left text-xs font-mono uppercase tracking-wider text-zinc-400">
                  <th className="px-4 py-3">Pal</th>
                  <th className="px-4 py-3">Element</th>
                  <th className="px-4 py-3">Work Suitabilities</th>
                  <th className="px-4 py-3">Partner Skill</th>
                  <th className="px-4 py-3">Tier</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr
                    key={entry.id}
                    id={entry.id}
                    className="border-b border-zinc-800/80 align-top last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-100">{entry.name}</td>
                    <td className="px-4 py-3 text-zinc-300">{entry.element}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {entry.workSuitabilities.map((item) => (
                          <span
                            key={`${entry.id}:${item}`}
                            className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{entry.partnerSkill}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-mono text-zinc-300">
                        {entry.tier}
                      </span>
                    </td>
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
