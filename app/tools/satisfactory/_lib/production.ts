import {
  BUILDINGS,
  type BuildingId,
  RAW_RESOURCE_ITEMS,
  RECIPES_BY_ITEM_ID,
} from "../_data/satisfactory";

const MAX_CHAIN_DEPTH = 18;

type RawItemMeta = {
  itemName: string;
  isFluid: boolean;
};

const RAW_ITEM_META: Map<string, RawItemMeta> = new Map<string, RawItemMeta>(
  RAW_RESOURCE_ITEMS.map((item) => [
    item.itemId,
    {
      itemName: item.itemName,
      isFluid: Boolean("isFluid" in item && item.isFluid),
    },
  ]),
);
export type ProductionNode = {
  itemId: string;
  itemName: string;
  requiredRatePerMin: number;
  depth: number;
  parentItemId: string | null;
  buildingId: BuildingId | null;
  buildingName: string;
  baseMachines: number;
  basePowerMW: number;
};

export type RawInputRow = {
  itemId: string;
  itemName: string;
  ratePerMin: number;
  isFluid: boolean;
};

export type BuildingRow = {
  buildingId: BuildingId;
  buildingName: string;
  baseMachines: number;
  basePowerMW: number;
  footprintM2: number;
};

export type ProductionPlan = {
  targetItemId: string;
  targetItemName: string;
  targetRatePerMin: number;
  chain: ProductionNode[];
  rawInputs: RawInputRow[];
  buildingBreakdown: BuildingRow[];
  totalBaseMachines: number;
  totalBasePowerMW: number;
  totalFootprintM2: number;
  recursionClamped: boolean;
};

export type ClockAdjustedBuildingRow = BuildingRow & {
  machineClockPercent: number;
  adjustedMachines: number;
  adjustedPowerMW: number;
};

export type ClockAdjustedNode = ProductionNode & {
  machineClockPercent: number;
  adjustedMachines: number;
  adjustedPowerMW: number;
};

export function computeProductionPlan(targetItemId: string, targetRatePerMin: number): ProductionPlan {
  const targetRecipe = RECIPES_BY_ITEM_ID[targetItemId];
  const targetItemName = targetRecipe?.itemName ?? RAW_ITEM_META.get(targetItemId)?.itemName ?? targetItemId;
  const safeRate = normalizeRate(targetRatePerMin);

  const chain: ProductionNode[] = [];
  const rawInputsMap = new Map<string, RawInputRow>();
  const buildingsMap = new Map<BuildingId, BuildingRow>();
  let recursionClamped = false;

  const expand = (
    itemId: string,
    requiredRatePerMin: number,
    depth: number,
    parentItemId: string | null,
    trail: Set<string>,
  ) => {
    if (depth > MAX_CHAIN_DEPTH) {
      recursionClamped = true;
      return;
    }

    const recipe = RECIPES_BY_ITEM_ID[itemId];
    if (!recipe) {
      const knownRaw = RAW_ITEM_META.get(itemId);
      const row = rawInputsMap.get(itemId);
      if (row) {
        row.ratePerMin += requiredRatePerMin;
      } else {
        rawInputsMap.set(itemId, {
          itemId,
          itemName: knownRaw?.itemName ?? itemId,
          ratePerMin: requiredRatePerMin,
          isFluid: Boolean(knownRaw?.isFluid),
        });
      }

      chain.push({
        itemId,
        itemName: knownRaw?.itemName ?? itemId,
        requiredRatePerMin,
        depth,
        parentItemId,
        buildingId: null,
        buildingName: "Raw Resource",
        baseMachines: 0,
        basePowerMW: 0,
      });
      return;
    }

    if (trail.has(itemId)) {
      recursionClamped = true;
      return;
    }

    const building = BUILDINGS[recipe.buildingId];
    const baseMachines = requiredRatePerMin / recipe.outputPerMin;
    const basePowerMW = baseMachines * building.basePowerMW;

    chain.push({
      itemId: recipe.itemId,
      itemName: recipe.itemName,
      requiredRatePerMin,
      depth,
      parentItemId,
      buildingId: recipe.buildingId,
      buildingName: building.name,
      baseMachines,
      basePowerMW,
    });

    const buildingRow = buildingsMap.get(recipe.buildingId);
    if (buildingRow) {
      buildingRow.baseMachines += baseMachines;
      buildingRow.basePowerMW += basePowerMW;
    } else {
      buildingsMap.set(recipe.buildingId, {
        buildingId: recipe.buildingId,
        buildingName: building.name,
        baseMachines,
        basePowerMW,
        footprintM2: building.footprintM2,
      });
    }

    const nextTrail = new Set(trail);
    nextTrail.add(itemId);

    for (const ingredient of recipe.ingredients) {
      const nextRate = baseMachines * ingredient.ratePerMin;
      if (nextRate <= 0) {
        continue;
      }

      const knownRaw = RAW_ITEM_META.get(ingredient.itemId);
      if (knownRaw && ingredient.isFluid) {
        RAW_ITEM_META.set(ingredient.itemId, {
          itemName: knownRaw.itemName,
          isFluid: true,
        });
      }

      expand(ingredient.itemId, nextRate, depth + 1, itemId, nextTrail);
    }
  };

  expand(targetItemId, safeRate, 0, null, new Set<string>());

  const rawInputs = Array.from(rawInputsMap.values()).sort(
    (left, right) => right.ratePerMin - left.ratePerMin,
  );

  const buildingBreakdown = Array.from(buildingsMap.values()).sort(
    (left, right) => right.basePowerMW - left.basePowerMW,
  );

  const totalBaseMachines = buildingBreakdown.reduce((sum, row) => sum + row.baseMachines, 0);
  const totalBasePowerMW = buildingBreakdown.reduce((sum, row) => sum + row.basePowerMW, 0);
  const totalFootprintM2 = buildingBreakdown.reduce(
    (sum, row) => sum + row.baseMachines * row.footprintM2,
    0,
  );

  return {
    targetItemId,
    targetItemName,
    targetRatePerMin: safeRate,
    chain,
    rawInputs,
    buildingBreakdown,
    totalBaseMachines,
    totalBasePowerMW,
    totalFootprintM2,
    recursionClamped,
  };
}

export function adjustBuildingsForClockSpeed(
  rows: BuildingRow[],
  machineClockPercent: number,
): ClockAdjustedBuildingRow[] {
  const safeClockPercent = clampClock(machineClockPercent);
  const clockFactor = safeClockPercent / 100;

  return rows.map((row) => {
    const building = BUILDINGS[row.buildingId];
    const adjustedMachines = row.baseMachines / clockFactor;
    const adjustedPowerMW = adjustedMachines * building.basePowerMW * Math.pow(clockFactor, 1.6);

    return {
      ...row,
      machineClockPercent: safeClockPercent,
      adjustedMachines,
      adjustedPowerMW,
    };
  });
}

export function adjustNodesForClockSpeed(
  nodes: ProductionNode[],
  machineClockPercent: number,
): ClockAdjustedNode[] {
  const safeClockPercent = clampClock(machineClockPercent);
  const clockFactor = safeClockPercent / 100;

  return nodes.map((node) => {
    if (!node.buildingId) {
      return {
        ...node,
        machineClockPercent: safeClockPercent,
        adjustedMachines: 0,
        adjustedPowerMW: 0,
      };
    }

    const building = BUILDINGS[node.buildingId];
    const adjustedMachines = node.baseMachines / clockFactor;
    const adjustedPowerMW = adjustedMachines * building.basePowerMW * Math.pow(clockFactor, 1.6);

    return {
      ...node,
      machineClockPercent: safeClockPercent,
      adjustedMachines,
      adjustedPowerMW,
    };
  });
}

export function clampClock(clockPercent: number) {
  if (!Number.isFinite(clockPercent)) {
    return 100;
  }
  return Math.min(250, Math.max(1, clockPercent));
}

function normalizeRate(rate: number) {
  if (!Number.isFinite(rate)) {
    return 0;
  }
  return Math.max(0, rate);
}
