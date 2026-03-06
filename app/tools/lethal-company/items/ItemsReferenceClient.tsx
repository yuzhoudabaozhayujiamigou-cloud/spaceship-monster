"use client";

import { useMemo, useState } from "react";

export type ItemRarity = "Common" | "Uncommon" | "Rare" | "Very Rare";
export type DangerLevel = "Low" | "Medium" | "High";

export type ScrapItem = {
  id: string;
  name: string;
  valueMin: number;
  valueMax: number;
  weightLb: number;
  rarity: ItemRarity;
  spawn: string;
  danger: DangerLevel;
  note: string;
};

type RarityFilter = "All" | ItemRarity;
type DangerFilter = "All" | DangerLevel;

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function rarityStyles(rarity: ItemRarity) {
  if (rarity === "Very Rare") {
    return "border-red-500/40 bg-red-500/10 text-red-200";
  }

  if (rarity === "Rare") {
    return "border-orange-500/40 bg-orange-500/10 text-orange-200";
  }

  if (rarity === "Uncommon") {
    return "border-amber-500/40 bg-amber-500/10 text-amber-200";
  }

  return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
}

function dangerStyles(danger: DangerLevel) {
  if (danger === "High") {
    return "border-red-500/40 bg-red-500/10 text-red-200";
  }

  if (danger === "Medium") {
    return "border-yellow-500/40 bg-yellow-500/10 text-yellow-200";
  }

  return "border-zinc-700 bg-zinc-900 text-zinc-300";
}

function formatWeight(weightLb: number) {
  return `${weightLb.toFixed(0)} lb`;
}

export default function ItemsReferenceClient({ items }: { items: ScrapItem[] }) {
  const [query, setQuery] = useState("");
  const [rarity, setRarity] = useState<RarityFilter>("All");
  const [danger, setDanger] = useState<DangerFilter>("All");

  const filtered = useMemo(() => {
    const q = normalize(query);

    return items.filter((item) => {
      if (rarity !== "All" && item.rarity !== rarity) return false;
      if (danger !== "All" && item.danger !== danger) return false;
      if (!q) return true;

      const searchable = normalize(
        `${item.name} ${item.valueMin} ${item.valueMax} ${item.weightLb} ${item.rarity} ${item.spawn} ${item.note} ${item.danger}`,
      );

      return searchable.includes(q);
    });
  }, [danger, items, query, rarity]);

  const rarityFilters: RarityFilter[] = [
    "All",
    "Common",
    "Uncommon",
    "Rare",
    "Very Rare",
  ];
  const dangerFilters: DangerFilter[] = ["All", "Low", "Medium", "High"];

  return (
    <>
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <div className="text-xs font-mono text-zinc-500">search</div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search item, rarity, location, or notes..."
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <div className="text-xs font-mono text-zinc-500">danger</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {dangerFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setDanger(filter)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    danger === filter
                      ? "border-zinc-500 bg-zinc-900 text-zinc-100"
                      : "border-zinc-800 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-950/60"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs font-mono text-zinc-500">rarity</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {rarityFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setRarity(filter)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  rarity === filter
                    ? "border-zinc-500 bg-zinc-900 text-zinc-100"
                    : "border-zinc-800 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-950/60"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">All Scrap Items</h2>
          <span className="text-xs text-zinc-500">{filtered.length} results</span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 text-sm text-zinc-400">
            No matches with current filters. Try a broader search or reset filters.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/40">
            <table className="min-w-full text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-950/70">
                <tr className="text-left text-xs font-mono uppercase tracking-wider text-zinc-400">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Weight</th>
                  <th className="px-4 py-3">Rarity</th>
                  <th className="px-4 py-3">Spawn</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    id={item.id}
                    className="border-b border-zinc-800/80 last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-100">{item.name}</td>
                    <td className="px-4 py-3 font-mono text-zinc-300">
                      {item.valueMin} - {item.valueMax}
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-300">
                      {formatWeight(item.weightLb)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${rarityStyles(
                          item.rarity,
                        )}`}
                      >
                        {item.rarity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{item.spawn}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      <span
                        className={`mr-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${dangerStyles(
                          item.danger,
                        )}`}
                      >
                        {item.danger}
                      </span>
                      {item.note}
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
