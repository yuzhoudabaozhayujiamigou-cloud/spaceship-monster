export type PalElement =
  | "Neutral"
  | "Fire"
  | "Water"
  | "Grass"
  | "Electric"
  | "Ice"
  | "Ground"
  | "Dark"
  | "Dragon";

export type PalRarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary";

export type WorkType =
  | "Kindling"
  | "Watering"
  | "Planting"
  | "Generating"
  | "Handiwork"
  | "Gathering"
  | "Lumbering"
  | "Mining"
  | "Cooling"
  | "Transporting"
  | "Farming";

export interface WorkSuitability {
  type: WorkType;
  level: 1 | 2 | 3 | 4;
}

export interface PartnerSkill {
  name: string;
  description: string;
}

export interface ItemDrop {
  item: string;
  quantity?: string;
  dropRate?: "Common" | "Uncommon" | "Rare";
}

export interface PaldeckEntry {
  id: number;
  name: string;
  element: PalElement;
  secondaryElement?: PalElement;
  rarity: PalRarity;
  workSuitability: WorkSuitability[];
  partnerSkill?: PartnerSkill;
  drops?: ItemDrop[];
  imageUrl?: string;
  description: string;
  location?: string;
  breedingPower?: number;
}

export interface PaldeckFilter {
  searchTerm?: string;
  elements?: PalElement[];
  workTypes?: WorkType[];
  rarities?: PalRarity[];
  minWorkLevel?: 1 | 2 | 3 | 4;
}

export type PaldeckSortOption =
  | "id-asc"
  | "id-desc"
  | "name-asc"
  | "name-desc"
  | "rarity-asc"
  | "rarity-desc";
