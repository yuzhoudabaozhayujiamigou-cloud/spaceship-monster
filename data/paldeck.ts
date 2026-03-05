import type {
  ItemDrop,
  PalElement,
  PalRarity,
  PaldeckEntry,
  WorkSuitability,
  WorkType,
} from "@/types/paldeck";

const PAL_NAMES = [
  "Lamball",
  "Cattiva",
  "Chikipi",
  "Foxparks",
  "Sparkit",
  "Rooby",
  "Jolthog",
  "Pengullet",
  "Penking",
  "Fuack",
  "Tanzee",
  "Lifmunk",
  "Depresso",
  "Daedream",
  "Nox",
  "Direhowl",
  "Melpaca",
  "Caprity",
  "Rushoar",
  "Tocotoco",
  "Flopie",
  "Hangyu",
  "Vixy",
  "Cremis",
  "Mau",
  "Mau Cryst",
  "Celaray",
  "Dumud",
  "Eikthyrdeer",
  "Eikthyrdeer Terra",
  "Gumoss",
  "Killamari",
  "Swee",
  "Sweepa",
  "Rayhound",
  "Kitsun",
  "Reptyro",
  "Reptyro Cryst",
  "Anubis",
  "Vanwyrm",
  "Vanwyrm Cryst",
  "Beakon",
  "Ragnahawk",
  "Orserk",
  "Helzephyr",
  "Lyleen",
  "Lyleen Noct",
  "Jormuntide",
  "Jormuntide Ignis",
  "Faleris",
  "Pyrin",
  "Pyrin Noct",
  "Blazehowl",
  "Blazehowl Noct",
  "Astegon",
  "Shadowbeak",
  "Frostallion",
  "Frostallion Noct",
  "Necromus",
  "Paladius",
] as const;

const ELEMENT_ROTATION: PalElement[] = [
  "Neutral",
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Ice",
  "Ground",
  "Dark",
  "Dragon",
];

const WORK_ROTATION: WorkType[] = [
  "Kindling",
  "Watering",
  "Planting",
  "Generating",
  "Handiwork",
  "Gathering",
  "Lumbering",
  "Mining",
  "Cooling",
  "Transporting",
  "Farming",
];

const LOCATION_ROTATION = [
  "Starter grasslands",
  "Forest edge",
  "Coastline",
  "Rocky highlands",
  "Volcanic zone",
  "Frozen ridge",
  "Desert ruins",
  "Night biome",
] as const;

const ELEMENT_OVERRIDES: Record<string, PalElement> = {
  Foxparks: "Fire",
  Sparkit: "Electric",
  Pengullet: "Water",
  Penking: "Water",
  Lifmunk: "Grass",
  Daedream: "Dark",
  Nox: "Dark",
  Jolthog: "Electric",
  Vanwyrm: "Fire",
  "Vanwyrm Cryst": "Ice",
  Beakon: "Electric",
  Ragnahawk: "Fire",
  Orserk: "Electric",
  Helzephyr: "Dark",
  Anubis: "Ground",
  Lyleen: "Grass",
  "Lyleen Noct": "Dark",
  Jormuntide: "Water",
  "Jormuntide Ignis": "Fire",
  Faleris: "Fire",
  Pyrin: "Fire",
  "Pyrin Noct": "Dark",
  Blazehowl: "Fire",
  "Blazehowl Noct": "Dark",
  Astegon: "Dragon",
  Shadowbeak: "Dark",
  Frostallion: "Ice",
  "Frostallion Noct": "Dark",
  Necromus: "Dark",
  Paladius: "Neutral",
};

const SECONDARY_ELEMENT_OVERRIDES: Record<string, PalElement> = {
  Pengullet: "Ice",
  Penking: "Ice",
  "Mau Cryst": "Ice",
  "Eikthyrdeer Terra": "Ground",
  "Vanwyrm Cryst": "Dragon",
  "Reptyro Cryst": "Ice",
  "Lyleen Noct": "Dark",
  "Jormuntide Ignis": "Dragon",
  "Pyrin Noct": "Dark",
  "Blazehowl Noct": "Dark",
  "Frostallion Noct": "Dark",
};

const RARITY_OVERRIDES: Record<string, PalRarity> = {
  Anubis: "Epic",
  Lyleen: "Epic",
  "Lyleen Noct": "Epic",
  Jormuntide: "Epic",
  "Jormuntide Ignis": "Epic",
  Orserk: "Epic",
  Astegon: "Epic",
  Shadowbeak: "Epic",
  Frostallion: "Legendary",
  "Frostallion Noct": "Legendary",
  Necromus: "Legendary",
  Paladius: "Legendary",
};

const WORK_OVERRIDES: Record<string, WorkSuitability[]> = {
  Lamball: [
    { type: "Handiwork", level: 1 },
    { type: "Transporting", level: 1 },
    { type: "Farming", level: 1 },
  ],
  Chikipi: [
    { type: "Farming", level: 1 },
    { type: "Gathering", level: 1 },
  ],
  Foxparks: [
    { type: "Kindling", level: 1 },
    { type: "Gathering", level: 1 },
  ],
  Sparkit: [
    { type: "Generating", level: 2 },
    { type: "Handiwork", level: 1 },
    { type: "Transporting", level: 1 },
  ],
  Penking: [
    { type: "Watering", level: 2 },
    { type: "Mining", level: 2 },
    { type: "Cooling", level: 2 },
  ],
  Lifmunk: [
    { type: "Planting", level: 2 },
    { type: "Handiwork", level: 1 },
    { type: "Gathering", level: 1 },
    { type: "Lumbering", level: 1 },
  ],
  Depresso: [
    { type: "Mining", level: 1 },
    { type: "Handiwork", level: 1 },
    { type: "Transporting", level: 1 },
  ],
  Rushoar: [
    { type: "Mining", level: 2 },
    { type: "Lumbering", level: 1 },
  ],
  Anubis: [
    { type: "Handiwork", level: 4 },
    { type: "Mining", level: 3 },
    { type: "Transporting", level: 2 },
  ],
  Orserk: [
    { type: "Generating", level: 4 },
    { type: "Handiwork", level: 2 },
    { type: "Transporting", level: 2 },
  ],
  Lyleen: [
    { type: "Planting", level: 4 },
    { type: "Handiwork", level: 3 },
    { type: "Transporting", level: 3 },
  ],
  Jormuntide: [
    { type: "Watering", level: 4 },
    { type: "Transporting", level: 2 },
  ],
  "Jormuntide Ignis": [
    { type: "Kindling", level: 4 },
    { type: "Transporting", level: 2 },
  ],
};

const DROP_ROTATION: ItemDrop[][] = [
  [
    { item: "Leather", quantity: "1-2", dropRate: "Common" },
    { item: "Pal Fluids", quantity: "1", dropRate: "Common" },
  ],
  [
    { item: "Bone", quantity: "1-2", dropRate: "Common" },
    { item: "High Quality Cloth", quantity: "1", dropRate: "Uncommon" },
  ],
  [
    { item: "Ancient Civilization Parts", quantity: "1-2", dropRate: "Uncommon" },
    { item: "Rare Organ", quantity: "1", dropRate: "Rare" },
  ],
];

function defaultRarity(index: number): PalRarity {
  if (index < 24) return "Common";
  if (index < 42) return "Uncommon";
  if (index < 52) return "Rare";
  if (index < 58) return "Epic";
  return "Legendary";
}

function defaultWork(index: number): WorkSuitability[] {
  const a = WORK_ROTATION[index % WORK_ROTATION.length];
  const b = WORK_ROTATION[(index + 3) % WORK_ROTATION.length];
  const c = WORK_ROTATION[(index + 7) % WORK_ROTATION.length];

  return [
    { type: a, level: 1 + ((index + 0) % 3) as 1 | 2 | 3 },
    { type: b, level: 1 + ((index + 1) % 3) as 1 | 2 | 3 },
    { type: c, level: 1 + ((index + 2) % 2) as 1 | 2 },
  ];
}

const PARTNER_SKILL_NOTES = [
  "Boosts team gathering tempo during base loops.",
  "Improves consistency on routine production chains.",
  "Supports transport-heavy routes and item movement.",
  "Adds flexible utility in mixed exploration sessions.",
  "Helps stabilize squad pace in high-variance zones.",
] as const;

export const PALDECK_ENTRIES: PaldeckEntry[] = PAL_NAMES.map((name, index) => {
  const id = index + 1;

  return {
    id,
    name,
    element: ELEMENT_OVERRIDES[name] ?? ELEMENT_ROTATION[index % ELEMENT_ROTATION.length],
    secondaryElement: SECONDARY_ELEMENT_OVERRIDES[name],
    rarity: RARITY_OVERRIDES[name] ?? defaultRarity(index),
    workSuitability: WORK_OVERRIDES[name] ?? defaultWork(index),
    partnerSkill: {
      name: `${name} Protocol`,
      description: PARTNER_SKILL_NOTES[index % PARTNER_SKILL_NOTES.length],
    },
    drops: DROP_ROTATION[index % DROP_ROTATION.length],
    description: `${name} is a seed MVP entry for Paldeck discovery, tuned for quick filtering by element and work suitability.`,
    location: LOCATION_ROTATION[index % LOCATION_ROTATION.length],
    breedingPower: Math.max(10, 1600 - index * 22),
  };
});
