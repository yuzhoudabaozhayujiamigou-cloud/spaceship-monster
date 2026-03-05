"use client";

import { useMemo, useState } from "react";

export type ScrapItem = {
  id: string;
  name: string;
  category: string;
  valueMin: number;
  valueMax: number;
  valuePlan: number;
  note: string;
};

type ValueBand = "All" | "Low" | "Mid" | "High";

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function inBand(item: ScrapItem, band: ValueBand) {
  if (band === "All") return true;
  if (band === "Low") return item.valuePlan < 40;
  if (band === "Mid") return item.valuePlan >= 40 && item.valuePlan < 80;
  return item.valuePlan >= 80;
}

export default function ItemsReferenceClient({ items }: { items: ScrapItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [band, setBand] = useState<ValueBand>("All");

  const categories = useMemo(
    () => ["All", ...new Set(items.map((item) => item.category))],
    [items],
  );

  const filtered = useMemo(() => {
    const q = normalize(query);
    return items.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (!inBand(item, band)) return false;
      if (!q) return true;
      const text = normalize(
        `${item.name} ${item.category} ${item.note} ${item.valueMin} ${item.valueMax} ${item.valuePlan}`,
      );
      return text.includes(q);
    });
  }, [items, query, category, band]);

  return (
    <>
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <div className="text-xs font-mono text-zinc-500">search</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search item, note, or value..."
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <div className="text-xs font-mono text-zinc-500">value band</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["All", "Low", "Mid", "High"] as ValueBand[]).map((valueBand) => (
                <button
                  key={valueBand}
                  type="button"
                  onClick={() => setBand(valueBand)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    band === valueBand
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      : "border-zinc-800 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-950/60"
                  }`}
                >
                  {valueBand === "Low"
                    ? "Low (<40)"
                    : valueBand === "Mid"
                      ? "Mid (40-79)"
                      : valueBand === "High"
                        ? "High (80+)"
                        : "All"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs font-mono text-zinc-500">category</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  category === cat
                    ? "border-zinc-600 bg-zinc-900 text-zinc-100"
                    : "border-zinc-800 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-950/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">Scrap Value Table</h2>
          <span className="text-xs text-zinc-500">{filtered.length} results</span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 text-sm text-zinc-400">
            No matches with current filters. Clear search or switch category/value band.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/40">
            <table className="min-w-full text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-950/70">
                <tr className="text-left text-xs font-mono uppercase tracking-wider text-zinc-400">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Range</th>
                  <th className="px-4 py-3">Plan Value</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} id={item.id} className="border-b border-zinc-800/80 last:border-b-0">
                    <td className="px-4 py-3 font-medium text-zinc-100">{item.name}</td>
                    <td className="px-4 py-3 text-zinc-300">{item.category}</td>
                    <td className="px-4 py-3 font-mono text-zinc-300">
                      {item.valueMin} - {item.valueMax}
                    </td>
                    <td className="px-4 py-3 font-mono text-emerald-300">{item.valuePlan}</td>
                    <td className="px-4 py-3 text-zinc-400">{item.note}</td>
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
