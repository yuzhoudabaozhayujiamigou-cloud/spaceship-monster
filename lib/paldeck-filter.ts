import type {
  PalRarity,
  PaldeckEntry,
  PaldeckFilter,
  PaldeckSortOption,
} from "@/types/paldeck";

const RARITY_ORDER: Record<PalRarity, number> = {
  Common: 1,
  Uncommon: 2,
  Rare: 3,
  Epic: 4,
  Legendary: 5,
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function searchPals(pals: PaldeckEntry[], searchTerm: string) {
  const q = normalize(searchTerm);
  if (!q) return pals;

  return pals.filter((pal) => {
    const haystack = normalize(
      [
        pal.name,
        pal.element,
        pal.secondaryElement ?? "",
        pal.rarity,
        pal.description,
        pal.location ?? "",
        pal.partnerSkill?.name ?? "",
        pal.partnerSkill?.description ?? "",
        pal.workSuitability.map((w) => `${w.type} ${w.level}`).join(" "),
      ].join(" "),
    );
    return haystack.includes(q);
  });
}

export function filterPals(pals: PaldeckEntry[], filter: PaldeckFilter) {
  return pals.filter((pal) => {
    if (filter.elements?.length) {
      const matchesElement =
        filter.elements.includes(pal.element) ||
        (pal.secondaryElement ? filter.elements.includes(pal.secondaryElement) : false);
      if (!matchesElement) return false;
    }

    if (filter.workTypes?.length) {
      const hasWorkType = pal.workSuitability.some((work) =>
        filter.workTypes?.includes(work.type),
      );
      if (!hasWorkType) return false;
    }

    if (filter.minWorkLevel) {
      const hasMinLevel = pal.workSuitability.some(
        (work) => work.level >= filter.minWorkLevel!,
      );
      if (!hasMinLevel) return false;
    }

    if (filter.rarities?.length && !filter.rarities.includes(pal.rarity)) {
      return false;
    }

    return true;
  });
}

export function sortPals(pals: PaldeckEntry[], sortOption: PaldeckSortOption) {
  const sorted = [...pals];

  sorted.sort((a, b) => {
    if (sortOption === "id-asc") return a.id - b.id;
    if (sortOption === "id-desc") return b.id - a.id;
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    if (sortOption === "rarity-asc") return RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
    return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
  });

  return sorted;
}
