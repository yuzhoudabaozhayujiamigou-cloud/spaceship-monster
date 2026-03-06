export type ToolLink = {
  slug: string;
  name: string;
  description: string;
  href: string;
};

export const SATISFACTORY_TOOL_LINKS: ToolLink[] = [
  {
    slug: "production-calculator",
    name: "Production Calculator",
    description: "Compute full production chains, raw inputs, and machine counts.",
    href: "/tools/satisfactory/production-calculator/",
  },
  {
    slug: "power-calculator",
    name: "Power Calculator",
    description: "Estimate factory MW demand and recommended generator setups.",
    href: "/tools/satisfactory/power-calculator/",
  },
  {
    slug: "belt-pipe-calculator",
    name: "Belt/Pipe Calculator",
    description: "Calculate throughput, utilization, and bottlenecks for logistics.",
    href: "/tools/satisfactory/belt-pipe-calculator/",
  },
  {
    slug: "building-planner",
    name: "Building Planner",
    description: "Turn production goals into floor area and layout planning.",
    href: "/tools/satisfactory/building-planner/",
  },
  {
    slug: "resource-map",
    name: "Resource Map",
    description: "Filter node locations by purity and region to pick better sites.",
    href: "/tools/satisfactory/resource-map/",
  },
];

export type BuildingId =
  | "miner"
  | "water-extractor"
  | "oil-extractor"
  | "smelter"
  | "constructor"
  | "foundry"
  | "assembler"
  | "manufacturer"
  | "refinery"
  | "blender";

export type BuildingSpec = {
  id: BuildingId;
  name: string;
  basePowerMW: number;
  footprintM2: number;
};

export const BUILDINGS: Record<BuildingId, BuildingSpec> = {
  miner: {
    id: "miner",
    name: "Miner",
    basePowerMW: 12,
    footprintM2: 84,
  },
  "water-extractor": {
    id: "water-extractor",
    name: "Water Extractor",
    basePowerMW: 20,
    footprintM2: 120,
  },
  "oil-extractor": {
    id: "oil-extractor",
    name: "Oil Extractor",
    basePowerMW: 40,
    footprintM2: 196,
  },
  smelter: {
    id: "smelter",
    name: "Smelter",
    basePowerMW: 4,
    footprintM2: 54,
  },
  constructor: {
    id: "constructor",
    name: "Constructor",
    basePowerMW: 4,
    footprintM2: 88,
  },
  foundry: {
    id: "foundry",
    name: "Foundry",
    basePowerMW: 16,
    footprintM2: 108,
  },
  assembler: {
    id: "assembler",
    name: "Assembler",
    basePowerMW: 15,
    footprintM2: 150,
  },
  manufacturer: {
    id: "manufacturer",
    name: "Manufacturer",
    basePowerMW: 55,
    footprintM2: 342,
  },
  refinery: {
    id: "refinery",
    name: "Refinery",
    basePowerMW: 30,
    footprintM2: 200,
  },
  blender: {
    id: "blender",
    name: "Blender",
    basePowerMW: 75,
    footprintM2: 192,
  },
};

export type GeneratorId = "biomass" | "coal" | "fuel" | "turbofuel" | "nuclear";

export type GeneratorSpec = {
  id: GeneratorId;
  name: string;
  outputMW: number;
  fuelLabel: string;
  fuelPerMin: number;
  waterPerMin?: number;
};

export const GENERATORS: GeneratorSpec[] = [
  {
    id: "biomass",
    name: "Biomass Burner",
    outputMW: 30,
    fuelLabel: "Solid Biofuel",
    fuelPerMin: 4.5,
  },
  {
    id: "coal",
    name: "Coal Generator",
    outputMW: 75,
    fuelLabel: "Coal",
    fuelPerMin: 15,
    waterPerMin: 45,
  },
  {
    id: "fuel",
    name: "Fuel Generator",
    outputMW: 250,
    fuelLabel: "Fuel",
    fuelPerMin: 12,
  },
  {
    id: "turbofuel",
    name: "Fuel Generator (Turbofuel)",
    outputMW: 300,
    fuelLabel: "Turbofuel",
    fuelPerMin: 4.5,
  },
  {
    id: "nuclear",
    name: "Nuclear Power Plant",
    outputMW: 2500,
    fuelLabel: "Uranium Fuel Rod",
    fuelPerMin: 0.2,
    waterPerMin: 300,
  },
];

export type ThroughputTier = {
  id: string;
  name: string;
  capacity: number;
};

export const BELT_TIERS: ThroughputTier[] = [
  { id: "mk1", name: "Conveyor Belt Mk.1", capacity: 60 },
  { id: "mk2", name: "Conveyor Belt Mk.2", capacity: 120 },
  { id: "mk3", name: "Conveyor Belt Mk.3", capacity: 270 },
  { id: "mk4", name: "Conveyor Belt Mk.4", capacity: 480 },
  { id: "mk5", name: "Conveyor Belt Mk.5", capacity: 780 },
  { id: "mk6", name: "Conveyor Belt Mk.6", capacity: 1200 },
];

export const PIPE_TIERS: ThroughputTier[] = [
  { id: "mk1", name: "Pipeline Mk.1", capacity: 300 },
  { id: "mk2", name: "Pipeline Mk.2", capacity: 600 },
];

export type RecipeIngredient = {
  itemId: string;
  itemName: string;
  ratePerMin: number;
  isFluid?: boolean;
};

export type Recipe = {
  itemId: string;
  itemName: string;
  outputPerMin: number;
  buildingId: BuildingId;
  ingredients: RecipeIngredient[];
};

export const RAW_RESOURCE_ITEMS = [
  { itemId: "iron-ore", itemName: "Iron Ore" },
  { itemId: "copper-ore", itemName: "Copper Ore" },
  { itemId: "limestone", itemName: "Limestone" },
  { itemId: "coal", itemName: "Coal" },
  { itemId: "crude-oil", itemName: "Crude Oil", isFluid: true },
  { itemId: "water", itemName: "Water", isFluid: true },
  { itemId: "caterium-ore", itemName: "Caterium Ore" },
  { itemId: "raw-quartz", itemName: "Raw Quartz" },
  { itemId: "sulfur", itemName: "Sulfur" },
  { itemId: "bauxite", itemName: "Bauxite" },
] as const;

export const RAW_ITEM_IDS = new Set<string>(RAW_RESOURCE_ITEMS.map((item) => item.itemId));

export const RECIPES: Recipe[] = [
  {
    itemId: "iron-ingot",
    itemName: "Iron Ingot",
    outputPerMin: 30,
    buildingId: "smelter",
    ingredients: [{ itemId: "iron-ore", itemName: "Iron Ore", ratePerMin: 30 }],
  },
  {
    itemId: "copper-ingot",
    itemName: "Copper Ingot",
    outputPerMin: 30,
    buildingId: "smelter",
    ingredients: [{ itemId: "copper-ore", itemName: "Copper Ore", ratePerMin: 30 }],
  },
  {
    itemId: "caterium-ingot",
    itemName: "Caterium Ingot",
    outputPerMin: 15,
    buildingId: "smelter",
    ingredients: [{ itemId: "caterium-ore", itemName: "Caterium Ore", ratePerMin: 45 }],
  },
  {
    itemId: "steel-ingot",
    itemName: "Steel Ingot",
    outputPerMin: 45,
    buildingId: "foundry",
    ingredients: [
      { itemId: "iron-ore", itemName: "Iron Ore", ratePerMin: 45 },
      { itemId: "coal", itemName: "Coal", ratePerMin: 45 },
    ],
  },
  {
    itemId: "concrete",
    itemName: "Concrete",
    outputPerMin: 15,
    buildingId: "constructor",
    ingredients: [{ itemId: "limestone", itemName: "Limestone", ratePerMin: 45 }],
  },
  {
    itemId: "iron-plate",
    itemName: "Iron Plate",
    outputPerMin: 20,
    buildingId: "constructor",
    ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", ratePerMin: 30 }],
  },
  {
    itemId: "iron-rod",
    itemName: "Iron Rod",
    outputPerMin: 15,
    buildingId: "constructor",
    ingredients: [{ itemId: "iron-ingot", itemName: "Iron Ingot", ratePerMin: 15 }],
  },
  {
    itemId: "screw",
    itemName: "Screw",
    outputPerMin: 40,
    buildingId: "constructor",
    ingredients: [{ itemId: "iron-rod", itemName: "Iron Rod", ratePerMin: 10 }],
  },
  {
    itemId: "wire",
    itemName: "Wire",
    outputPerMin: 30,
    buildingId: "constructor",
    ingredients: [{ itemId: "copper-ingot", itemName: "Copper Ingot", ratePerMin: 15 }],
  },
  {
    itemId: "cable",
    itemName: "Cable",
    outputPerMin: 30,
    buildingId: "constructor",
    ingredients: [{ itemId: "wire", itemName: "Wire", ratePerMin: 60 }],
  },
  {
    itemId: "copper-sheet",
    itemName: "Copper Sheet",
    outputPerMin: 10,
    buildingId: "constructor",
    ingredients: [{ itemId: "copper-ingot", itemName: "Copper Ingot", ratePerMin: 20 }],
  },
  {
    itemId: "steel-beam",
    itemName: "Steel Beam",
    outputPerMin: 15,
    buildingId: "constructor",
    ingredients: [{ itemId: "steel-ingot", itemName: "Steel Ingot", ratePerMin: 60 }],
  },
  {
    itemId: "steel-pipe",
    itemName: "Steel Pipe",
    outputPerMin: 20,
    buildingId: "constructor",
    ingredients: [{ itemId: "steel-ingot", itemName: "Steel Ingot", ratePerMin: 30 }],
  },
  {
    itemId: "quickwire",
    itemName: "Quickwire",
    outputPerMin: 60,
    buildingId: "constructor",
    ingredients: [{ itemId: "caterium-ingot", itemName: "Caterium Ingot", ratePerMin: 12 }],
  },
  {
    itemId: "silica",
    itemName: "Silica",
    outputPerMin: 37.5,
    buildingId: "constructor",
    ingredients: [{ itemId: "raw-quartz", itemName: "Raw Quartz", ratePerMin: 22.5 }],
  },
  {
    itemId: "plastic",
    itemName: "Plastic",
    outputPerMin: 20,
    buildingId: "refinery",
    ingredients: [{ itemId: "crude-oil", itemName: "Crude Oil", ratePerMin: 30, isFluid: true }],
  },
  {
    itemId: "rubber",
    itemName: "Rubber",
    outputPerMin: 20,
    buildingId: "refinery",
    ingredients: [{ itemId: "crude-oil", itemName: "Crude Oil", ratePerMin: 30, isFluid: true }],
  },
  {
    itemId: "sulfuric-acid",
    itemName: "Sulfuric Acid",
    outputPerMin: 50,
    buildingId: "refinery",
    ingredients: [
      { itemId: "sulfur", itemName: "Sulfur", ratePerMin: 50 },
      { itemId: "water", itemName: "Water", ratePerMin: 50, isFluid: true },
    ],
  },
  {
    itemId: "alumina-solution",
    itemName: "Alumina Solution",
    outputPerMin: 120,
    buildingId: "refinery",
    ingredients: [
      { itemId: "bauxite", itemName: "Bauxite", ratePerMin: 120 },
      { itemId: "water", itemName: "Water", ratePerMin: 180, isFluid: true },
    ],
  },
  {
    itemId: "aluminum-scrap",
    itemName: "Aluminum Scrap",
    outputPerMin: 360,
    buildingId: "refinery",
    ingredients: [
      {
        itemId: "alumina-solution",
        itemName: "Alumina Solution",
        ratePerMin: 240,
        isFluid: true,
      },
      { itemId: "coal", itemName: "Coal", ratePerMin: 120 },
    ],
  },
  {
    itemId: "aluminum-ingot",
    itemName: "Aluminum Ingot",
    outputPerMin: 60,
    buildingId: "foundry",
    ingredients: [
      { itemId: "aluminum-scrap", itemName: "Aluminum Scrap", ratePerMin: 90 },
      { itemId: "silica", itemName: "Silica", ratePerMin: 75 },
    ],
  },
  {
    itemId: "aluminum-casing",
    itemName: "Aluminum Casing",
    outputPerMin: 60,
    buildingId: "constructor",
    ingredients: [{ itemId: "aluminum-ingot", itemName: "Aluminum Ingot", ratePerMin: 90 }],
  },
  {
    itemId: "reinforced-iron-plate",
    itemName: "Reinforced Iron Plate",
    outputPerMin: 5,
    buildingId: "assembler",
    ingredients: [
      { itemId: "iron-plate", itemName: "Iron Plate", ratePerMin: 30 },
      { itemId: "screw", itemName: "Screw", ratePerMin: 60 },
    ],
  },
  {
    itemId: "rotor",
    itemName: "Rotor",
    outputPerMin: 4,
    buildingId: "assembler",
    ingredients: [
      { itemId: "iron-rod", itemName: "Iron Rod", ratePerMin: 20 },
      { itemId: "screw", itemName: "Screw", ratePerMin: 100 },
    ],
  },
  {
    itemId: "modular-frame",
    itemName: "Modular Frame",
    outputPerMin: 2,
    buildingId: "assembler",
    ingredients: [
      {
        itemId: "reinforced-iron-plate",
        itemName: "Reinforced Iron Plate",
        ratePerMin: 3,
      },
      { itemId: "iron-rod", itemName: "Iron Rod", ratePerMin: 12 },
    ],
  },
  {
    itemId: "encased-industrial-beam",
    itemName: "Encased Industrial Beam",
    outputPerMin: 6,
    buildingId: "assembler",
    ingredients: [
      { itemId: "steel-beam", itemName: "Steel Beam", ratePerMin: 24 },
      { itemId: "concrete", itemName: "Concrete", ratePerMin: 30 },
    ],
  },
  {
    itemId: "circuit-board",
    itemName: "Circuit Board",
    outputPerMin: 7.5,
    buildingId: "assembler",
    ingredients: [
      { itemId: "copper-sheet", itemName: "Copper Sheet", ratePerMin: 15 },
      { itemId: "plastic", itemName: "Plastic", ratePerMin: 30 },
    ],
  },
  {
    itemId: "ai-limiter",
    itemName: "AI Limiter",
    outputPerMin: 5,
    buildingId: "assembler",
    ingredients: [
      { itemId: "copper-sheet", itemName: "Copper Sheet", ratePerMin: 25 },
      { itemId: "quickwire", itemName: "Quickwire", ratePerMin: 100 },
    ],
  },
  {
    itemId: "alclad-aluminum-sheet",
    itemName: "Alclad Aluminum Sheet",
    outputPerMin: 30,
    buildingId: "assembler",
    ingredients: [
      { itemId: "aluminum-ingot", itemName: "Aluminum Ingot", ratePerMin: 30 },
      { itemId: "copper-ingot", itemName: "Copper Ingot", ratePerMin: 10 },
    ],
  },
  {
    itemId: "computer",
    itemName: "Computer",
    outputPerMin: 2.5,
    buildingId: "manufacturer",
    ingredients: [
      { itemId: "circuit-board", itemName: "Circuit Board", ratePerMin: 10 },
      { itemId: "cable", itemName: "Cable", ratePerMin: 9 },
      { itemId: "plastic", itemName: "Plastic", ratePerMin: 18 },
      { itemId: "screw", itemName: "Screw", ratePerMin: 52.5 },
    ],
  },
  {
    itemId: "high-speed-connector",
    itemName: "High-Speed Connector",
    outputPerMin: 3.75,
    buildingId: "manufacturer",
    ingredients: [
      { itemId: "quickwire", itemName: "Quickwire", ratePerMin: 210 },
      { itemId: "cable", itemName: "Cable", ratePerMin: 37.5 },
      { itemId: "circuit-board", itemName: "Circuit Board", ratePerMin: 3 },
    ],
  },
  {
    itemId: "heavy-modular-frame",
    itemName: "Heavy Modular Frame",
    outputPerMin: 2,
    buildingId: "manufacturer",
    ingredients: [
      { itemId: "modular-frame", itemName: "Modular Frame", ratePerMin: 10 },
      { itemId: "steel-pipe", itemName: "Steel Pipe", ratePerMin: 40 },
      { itemId: "encased-industrial-beam", itemName: "Encased Industrial Beam", ratePerMin: 10 },
      { itemId: "screw", itemName: "Screw", ratePerMin: 240 },
    ],
  },
  {
    itemId: "battery",
    itemName: "Battery",
    outputPerMin: 20,
    buildingId: "blender",
    ingredients: [
      { itemId: "sulfuric-acid", itemName: "Sulfuric Acid", ratePerMin: 50, isFluid: true },
      {
        itemId: "alumina-solution",
        itemName: "Alumina Solution",
        ratePerMin: 40,
        isFluid: true,
      },
      { itemId: "aluminum-casing", itemName: "Aluminum Casing", ratePerMin: 20 },
    ],
  },
];

export const RECIPES_BY_ITEM_ID: Record<string, Recipe> = Object.fromEntries(
  RECIPES.map((recipe) => [recipe.itemId, recipe]),
);

export const PRODUCT_OPTIONS = RECIPES.map((recipe) => ({
  itemId: recipe.itemId,
  itemName: recipe.itemName,
})).sort((left, right) => left.itemName.localeCompare(right.itemName));

export type NodePurity = "Impure" | "Normal" | "Pure";

export type ResourceNode = {
  id: string;
  resource: string;
  purity: NodePurity;
  region: string;
  x: number;
  y: number;
  nearby: string[];
  notes: string;
};

export const RESOURCE_NODES: ResourceNode[] = [
  {
    id: "iron-grass-fields-1",
    resource: "Iron Ore",
    purity: "Pure",
    region: "Grass Fields",
    x: 11,
    y: 80,
    nearby: ["Limestone", "Copper Ore"],
    notes: "Excellent early game starter cluster with flat build space.",
  },
  {
    id: "iron-grass-fields-2",
    resource: "Iron Ore",
    purity: "Normal",
    region: "Grass Fields",
    x: 16,
    y: 77,
    nearby: ["Limestone", "Coal"],
    notes: "Good overflow node when scaling to steel.",
  },
  {
    id: "iron-rocky-desert-1",
    resource: "Iron Ore",
    purity: "Pure",
    region: "Rocky Desert",
    x: 36,
    y: 30,
    nearby: ["Coal", "Limestone"],
    notes: "Strong iron + coal pairing for compact steel lines.",
  },
  {
    id: "iron-rocky-desert-2",
    resource: "Iron Ore",
    purity: "Normal",
    region: "Rocky Desert",
    x: 42,
    y: 28,
    nearby: ["Copper Ore"],
    notes: "Short belt routes to the coast side build plateaus.",
  },
  {
    id: "iron-northern-forest-1",
    resource: "Iron Ore",
    purity: "Pure",
    region: "Northern Forest",
    x: 59,
    y: 23,
    nearby: ["Copper Ore", "Caterium Ore"],
    notes: "High-yield node near many mid-game alternates.",
  },
  {
    id: "copper-grass-fields-1",
    resource: "Copper Ore",
    purity: "Normal",
    region: "Grass Fields",
    x: 18,
    y: 74,
    nearby: ["Iron Ore"],
    notes: "Reliable copper for wire, cable, and sheets.",
  },
  {
    id: "copper-rocky-desert-1",
    resource: "Copper Ore",
    purity: "Pure",
    region: "Rocky Desert",
    x: 39,
    y: 32,
    nearby: ["Iron Ore", "Limestone"],
    notes: "Great for scalable copper bus near desert cliffs.",
  },
  {
    id: "copper-dune-desert-1",
    resource: "Copper Ore",
    purity: "Pure",
    region: "Dune Desert",
    x: 83,
    y: 26,
    nearby: ["Coal"],
    notes: "High throughput option with wide expansion area.",
  },
  {
    id: "limestone-grass-fields-1",
    resource: "Limestone",
    purity: "Pure",
    region: "Grass Fields",
    x: 13,
    y: 83,
    nearby: ["Iron Ore"],
    notes: "Simple concrete supply right next to starter iron.",
  },
  {
    id: "limestone-rocky-desert-1",
    resource: "Limestone",
    purity: "Normal",
    region: "Rocky Desert",
    x: 32,
    y: 34,
    nearby: ["Iron Ore", "Copper Ore"],
    notes: "Useful for encased beam and foundation-heavy builds.",
  },
  {
    id: "coal-rocky-desert-1",
    resource: "Coal",
    purity: "Pure",
    region: "Rocky Desert",
    x: 34,
    y: 22,
    nearby: ["Water"],
    notes: "One of the best coal power expansion sites.",
  },
  {
    id: "coal-rocky-desert-2",
    resource: "Coal",
    purity: "Normal",
    region: "Rocky Desert",
    x: 30,
    y: 24,
    nearby: ["Iron Ore", "Water"],
    notes: "Pairs with nearby iron for steel-heavy districts.",
  },
  {
    id: "coal-dune-desert-1",
    resource: "Coal",
    purity: "Pure",
    region: "Dune Desert",
    x: 77,
    y: 20,
    nearby: ["Water", "Copper Ore"],
    notes: "Massive room for mega power blocks and rail stations.",
  },
  {
    id: "coal-northern-forest-1",
    resource: "Coal",
    purity: "Normal",
    region: "Northern Forest",
    x: 62,
    y: 29,
    nearby: ["Iron Ore", "Water"],
    notes: "Good bridge option before moving to oil power.",
  },
  {
    id: "crude-oil-gold-coast-1",
    resource: "Crude Oil",
    purity: "Pure",
    region: "Gold Coast",
    x: 46,
    y: 58,
    nearby: ["Water", "Coal"],
    notes: "High-value node for plastic/rubber/fuel complexes.",
  },
  {
    id: "crude-oil-gold-coast-2",
    resource: "Crude Oil",
    purity: "Pure",
    region: "Gold Coast",
    x: 50,
    y: 55,
    nearby: ["Water"],
    notes: "Easy coastal logistics and train-friendly terrain.",
  },
  {
    id: "crude-oil-spire-coast-1",
    resource: "Crude Oil",
    purity: "Normal",
    region: "Spire Coast",
    x: 67,
    y: 47,
    nearby: ["Water", "Nitrogen Gas"],
    notes: "Late-game petrochem hub with solid expansion routes.",
  },
  {
    id: "water-rocky-desert-1",
    resource: "Water",
    purity: "Pure",
    region: "Rocky Desert",
    x: 27,
    y: 17,
    nearby: ["Coal"],
    notes: "Stable intake for coal generators and refineries.",
  },
  {
    id: "water-dune-desert-1",
    resource: "Water",
    purity: "Pure",
    region: "Dune Desert",
    x: 76,
    y: 14,
    nearby: ["Coal", "Copper Ore"],
    notes: "Perfect for high-volume power campuses.",
  },
  {
    id: "water-gold-coast-1",
    resource: "Water",
    purity: "Pure",
    region: "Gold Coast",
    x: 52,
    y: 62,
    nearby: ["Crude Oil"],
    notes: "Supports refinery-heavy plastics and turbo fuel chains.",
  },
  {
    id: "caterium-northern-forest-1",
    resource: "Caterium Ore",
    purity: "Pure",
    region: "Northern Forest",
    x: 63,
    y: 21,
    nearby: ["Iron Ore", "Copper Ore"],
    notes: "Great quickwire source near electronics lines.",
  },
  {
    id: "caterium-swamp-1",
    resource: "Caterium Ore",
    purity: "Normal",
    region: "Swamp",
    x: 79,
    y: 52,
    nearby: ["Crude Oil", "Bauxite"],
    notes: "Good late-game satellite for connector parts.",
  },
  {
    id: "quartz-northern-forest-1",
    resource: "Raw Quartz",
    purity: "Normal",
    region: "Northern Forest",
    x: 55,
    y: 19,
    nearby: ["Caterium Ore"],
    notes: "Fast access to silica and crystal oscillator chains.",
  },
  {
    id: "quartz-rocky-desert-1",
    resource: "Raw Quartz",
    purity: "Pure",
    region: "Rocky Desert",
    x: 48,
    y: 26,
    nearby: ["Iron Ore", "Copper Ore"],
    notes: "Ideal for fused modular frame support lines.",
  },
  {
    id: "quartz-dune-desert-1",
    resource: "Raw Quartz",
    purity: "Normal",
    region: "Dune Desert",
    x: 88,
    y: 31,
    nearby: ["Copper Ore"],
    notes: "Large open area for train-fed quartz processing.",
  },
  {
    id: "sulfur-rocky-desert-1",
    resource: "Sulfur",
    purity: "Normal",
    region: "Rocky Desert",
    x: 41,
    y: 20,
    nearby: ["Coal", "Water"],
    notes: "Easy route into compact battery production.",
  },
  {
    id: "sulfur-dune-desert-1",
    resource: "Sulfur",
    purity: "Pure",
    region: "Dune Desert",
    x: 84,
    y: 34,
    nearby: ["Bauxite", "Water"],
    notes: "High-yield sulfur for turbofuel and batteries.",
  },
  {
    id: "bauxite-red-jungle-1",
    resource: "Bauxite",
    purity: "Pure",
    region: "Red Jungle",
    x: 73,
    y: 63,
    nearby: ["Water", "Coal", "Sulfur"],
    notes: "Top-tier aluminum district candidate.",
  },
  {
    id: "bauxite-red-jungle-2",
    resource: "Bauxite",
    purity: "Normal",
    region: "Red Jungle",
    x: 76,
    y: 66,
    nearby: ["Water"],
    notes: "Supports expansion from starter aluminum setup.",
  },
  {
    id: "bauxite-swamp-1",
    resource: "Bauxite",
    purity: "Normal",
    region: "Swamp",
    x: 82,
    y: 58,
    nearby: ["Sulfur", "Crude Oil"],
    notes: "Useful mixed-resource late-game campus location.",
  },
  {
    id: "nitrogen-spire-coast-1",
    resource: "Nitrogen Gas",
    purity: "Pure",
    region: "Spire Coast",
    x: 70,
    y: 44,
    nearby: ["Crude Oil", "Bauxite"],
    notes: "High-value late-game gas feed for particle products.",
  },
  {
    id: "uranium-red-jungle-1",
    resource: "Uranium",
    purity: "Normal",
    region: "Red Jungle",
    x: 92,
    y: 74,
    nearby: ["Water"],
    notes: "Viable nuclear starter with careful waste routing.",
  },
  {
    id: "uranium-swamp-1",
    resource: "Uranium",
    purity: "Impure",
    region: "Swamp",
    x: 87,
    y: 64,
    nearby: ["Water", "Sulfur"],
    notes: "Backup node; prioritize radiation-safe logistics first.",
  },
  {
    id: "sam-western-dunes-1",
    resource: "SAM",
    purity: "Normal",
    region: "Western Dune Forest",
    x: 22,
    y: 51,
    nearby: ["Iron Ore", "Coal"],
    notes: "Early access for MAM unlock progression.",
  },
  {
    id: "sam-spire-coast-1",
    resource: "SAM",
    purity: "Pure",
    region: "Spire Coast",
    x: 65,
    y: 40,
    nearby: ["Crude Oil", "Nitrogen Gas"],
    notes: "Strong late-game SAM throughput for advanced projects.",
  },
];
