"use client";

import { useEffect, useMemo, useState } from "react";

import {
  filterPals,
  searchPals,
  sortPals,
} from "@/lib/paldeck-filter";
import type {
  PalElement,
  PalRarity,
  PaldeckEntry,
  PaldeckSortOption,
  WorkType,
} from "@/types/paldeck";

const FILTER_STORAGE_KEY = "paldeck-mvp-filters-v1";
const RARITY_ORDER: PalRarity[] = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

type PersistedFilterState = {
  elements: PalElement[];
  workTypes: WorkType[];
  rarities: PalRarity[];
  minWorkLevel?: 1 | 2 | 3 | 4;
  sort: PaldeckSortOption;
};

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((item) => item !== value) : [...arr, value];
}

function rarityClasses(rarity: PalRarity) {
  if (rarity === "Legendary") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  }
  if (rarity === "Epic") {
    return "border-violet-500/30 bg-violet-500/10 text-violet-200";
  }
  if (rarity === "Rare") {
    return "border-sky-500/30 bg-sky-500/10 text-sky-200";
  }
  if (rarity === "Uncommon") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
  }
  return "border-zinc-700 bg-zinc-900 text-zinc-300";
}

export default function PaldeckClient({ entries }: { entries: PaldeckEntry[] }) {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [elements, setElements] = useState<PalElement[]>([]);
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [rarities, setRarities] = useState<PalRarity[]>([]);
  const [minWorkLevel, setMinWorkLevel] = useState<1 | 2 | 3 | 4 | undefined>();
  const [sortOption, setSortOption] = useState<PaldeckSortOption>("id-asc");
  const [hydrated, setHydrated] = useState(false);

  const allElements = useMemo(
    () =>
      Array.from(
        new Set(
          entries.flatMap((entry) =>
            entry.secondaryElement ? [entry.element, entry.secondaryElement] : [entry.element],
          ),
        ),
      ) as PalElement[],
    [entries],
  );

  const allWorkTypes = useMemo(
    () =>
      Array.from(
        new Set(entries.flatMap((entry) => entry.workSuitability.map((work) => work.type))),
      ) as WorkType[],
    [entries],
  );

  const elementCounts = useMemo(() => {
    const counts = new Map<PalElement, number>();
    allElements.forEach((element) => counts.set(element, 0));

    entries.forEach((entry) => {
      const bucket = new Set<PalElement>([entry.element]);
      if (entry.secondaryElement) bucket.add(entry.secondaryElement);
      bucket.forEach((element) => counts.set(element, (counts.get(element) ?? 0) + 1));
    });

    return counts;
  }, [allElements, entries]);

  const workTypeCounts = useMemo(() => {
    const counts = new Map<WorkType, number>();
    allWorkTypes.forEach((type) => counts.set(type, 0));

    entries.forEach((entry) => {
      entry.workSuitability.forEach((work) => {
        counts.set(work.type, (counts.get(work.type) ?? 0) + 1);
      });
    });

    return counts;
  }, [allWorkTypes, entries]);

  const rarityCounts = useMemo(() => {
    const counts = new Map<PalRarity, number>();
    RARITY_ORDER.forEach((rarity) => counts.set(rarity, 0));

    entries.forEach((entry) => {
      counts.set(entry.rarity, (counts.get(entry.rarity) ?? 0) + 1);
    });

    return counts;
  }, [entries]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FILTER_STORAGE_KEY);
      if (!raw) {
        setHydrated(true);
        return;
      }
      const parsed = JSON.parse(raw) as PersistedFilterState;
      setElements(parsed.elements ?? []);
      setWorkTypes(parsed.workTypes ?? []);
      setRarities(parsed.rarities ?? []);
      setMinWorkLevel(parsed.minWorkLevel);
      setSortOption(parsed.sort ?? "id-asc");
    } catch {
      // Ignore malformed local storage and continue with defaults.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: PersistedFilterState = {
      elements,
      workTypes,
      rarities,
      minWorkLevel,
      sort: sortOption,
    };
    window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(payload));
  }, [elements, hydrated, minWorkLevel, rarities, sortOption, workTypes]);

  const filteredAndSorted = useMemo(() => {
    const searched = searchPals(entries, searchTerm);
    const filtered = filterPals(searched, {
      elements,
      workTypes,
      rarities,
      minWorkLevel,
    });
    return sortPals(filtered, sortOption);
  }, [elements, entries, minWorkLevel, rarities, searchTerm, sortOption, workTypes]);

  const activeFilters = [
    ...elements.map((item) => ({ key: `el:${item}`, label: item })),
    ...workTypes.map((item) => ({ key: `work:${item}`, label: item })),
    ...rarities.map((item) => ({ key: `rarity:${item}`, label: item })),
    ...(minWorkLevel ? [{ key: "min-level", label: `Min work level ${minWorkLevel}` }] : []),
  ];

  function clearAll() {
    setSearchInput("");
    setSearchTerm("");
    setElements([]);
    setWorkTypes([]);
    setRarities([]);
    setMinWorkLevel(undefined);
    setSortOption("id-asc");
  }

  function removeActiveFilter(item: { key: string; label: string }) {
    if (item.key.startsWith("el:")) {
      setElements((prev) => prev.filter((el) => el !== item.label));
      return;
    }
    if (item.key.startsWith("work:")) {
      setWorkTypes((prev) => prev.filter((work) => work !== item.label));
      return;
    }
    if (item.key.startsWith("rarity:")) {
      setRarities((prev) => prev.filter((rarity) => rarity !== item.label));
      return;
    }
    setMinWorkLevel(undefined);
  }

  return (
    <>
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="text-xs font-mono text-zinc-500">search</div>
            <div className="mt-2 flex gap-2">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, element, skill, location, or role..."
                className="w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600"
              />
              {searchInput ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                  }}
                  className="rounded-xl border border-zinc-800 bg-[#0a0a0a] px-3 py-3 text-xs text-zinc-300 hover:bg-zinc-950/60"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          <div>
            <div className="text-xs font-mono text-zinc-500">sort</div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as PaldeckSortOption)}
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-3 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            >
              <option value="id-asc">Paldeck # (ascending)</option>
              <option value="id-desc">Paldeck # (descending)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="rarity-asc">Rarity (Common to Legendary)</option>
              <option value="rarity-desc">Rarity (Legendary to Common)</option>
            </select>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-xs font-mono text-zinc-500">element</div>
            <button
              type="button"
              onClick={() => setElements([])}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allElements.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setElements((prev) => toggle(prev, item))}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  elements.includes(item)
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                    : "border-zinc-800 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-950/60"
                }`}
              >
                {item} ({elementCounts.get(item) ?? 0})
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-xs font-mono text-zinc-500">work suitability</div>
            <button
              type="button"
              onClick={() => setWorkTypes([])}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allWorkTypes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setWorkTypes((prev) => toggle(prev, item))}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  workTypes.includes(item)
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                    : "border-zinc-800 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-950/60"
                }`}
              >
                {item} ({workTypeCounts.get(item) ?? 0})
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-xs font-mono text-zinc-500">rarity</div>
              <button
                type="button"
                onClick={() => setRarities([])}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {RARITY_ORDER.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRarities((prev) => toggle(prev, item))}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    rarities.includes(item)
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      : "border-zinc-800 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-950/60"
                  }`}
                >
                  {item} ({rarityCounts.get(item) ?? 0})
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <div className="text-xs font-mono text-zinc-500">minimum work level</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMinWorkLevel(undefined)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  minWorkLevel == null
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                    : "border-zinc-800 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-950/60"
                }`}
              >
                All
              </button>
              {[1, 2, 3, 4].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setMinWorkLevel(level as 1 | 2 | 3 | 4)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    minWorkLevel === level
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      : "border-zinc-800 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-950/60"
                  }`}
                >
                  Lv{level}+
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-500">Active filters:</span>
          {activeFilters.length === 0 ? (
            <span className="rounded-full border border-zinc-800 bg-[#0a0a0a] px-3 py-1 text-zinc-400">
              None
            </span>
          ) : (
            activeFilters.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => removeActiveFilter(item)}
                className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-zinc-300 hover:bg-zinc-800/80"
              >
                {item.label} ×
              </button>
            ))
          )}
          <button
            type="button"
            onClick={clearAll}
            className="rounded-full border border-zinc-700 bg-[#0a0a0a] px-3 py-1 text-zinc-300 hover:bg-zinc-950/60"
          >
            Clear all
          </button>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">Paldeck List</h2>
          <span className="text-xs text-zinc-500">{filteredAndSorted.length} results</span>
        </div>

        {filteredAndSorted.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 text-sm text-zinc-400">
            No pals matched your current search and filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAndSorted.map((entry) => (
              <article
                key={entry.id}
                id={`pal-${String(entry.id).padStart(3, "0")}`}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono text-zinc-500">
                      #{String(entry.id).padStart(3, "0")}
                    </div>
                    <h3 className="mt-1 text-lg font-semibold">{entry.name}</h3>
                  </div>
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-mono ${rarityClasses(entry.rarity)}`}>
                    {entry.rarity}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-200">
                    {entry.element}
                  </span>
                  {entry.secondaryElement ? (
                    <span className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-200">
                      {entry.secondaryElement}
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{entry.description}</p>

                <div className="mt-3">
                  <div className="text-xs font-mono text-zinc-500">work suitability</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {entry.workSuitability.map((work) => (
                      <span
                        key={`${entry.id}:${work.type}`}
                        className="inline-flex rounded-full border border-zinc-700 bg-[#0a0a0a] px-2 py-1 text-xs text-zinc-300"
                      >
                        {work.type} Lv{work.level}
                      </span>
                    ))}
                  </div>
                </div>

                {entry.partnerSkill ? (
                  <div className="mt-3 text-xs text-zinc-400">
                    <span className="font-semibold text-zinc-300">Partner skill:</span>{" "}
                    {entry.partnerSkill.name}
                  </div>
                ) : null}

                {entry.location ? (
                  <div className="mt-2 text-xs text-zinc-500">Location: {entry.location}</div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
