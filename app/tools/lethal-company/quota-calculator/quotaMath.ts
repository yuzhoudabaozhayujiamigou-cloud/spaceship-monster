const BASE_QUOTA = 130;
const MIN_MULTIPLIER = 0.5;
const MAX_MULTIPLIER = 1.5;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function normalizeQuotaNumber(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

function growthFactor(runCount: number): number {
  const safeRunCount = clamp(Math.floor(runCount), 0, 10_000);
  return clamp(1 + (safeRunCount * safeRunCount) / 16, 1, 10_000);
}

export function estimateIncreaseForNextQuota(
  currentQuotaNumber: number,
  randomMultiplier = 1,
): number {
  const quotaNumber = normalizeQuotaNumber(currentQuotaNumber);
  const runCount = quotaNumber - 1;
  const safeMultiplier = clamp(randomMultiplier, MIN_MULTIPLIER, MAX_MULTIPLIER);
  const increase = 100 * growthFactor(runCount) * safeMultiplier;
  return Math.floor(increase);
}

export function estimateQuotaValue(quotaNumber: number, randomMultiplier = 1): number {
  const safeQuotaNumber = normalizeQuotaNumber(quotaNumber);

  let quota = BASE_QUOTA;
  for (let n = 1; n < safeQuotaNumber; n += 1) {
    quota += estimateIncreaseForNextQuota(n, randomMultiplier);
  }

  return quota;
}

export function estimateNextQuotaRange(currentQuotaNumber: number) {
  const currentQuota = estimateQuotaValue(currentQuotaNumber, 1);

  return {
    currentQuota,
    low: currentQuota + estimateIncreaseForNextQuota(currentQuotaNumber, MIN_MULTIPLIER),
    average: currentQuota + estimateIncreaseForNextQuota(currentQuotaNumber, 1),
    high: currentQuota + estimateIncreaseForNextQuota(currentQuotaNumber, MAX_MULTIPLIER),
  };
}

export type QuotaTableRow = {
  quotaNumber: number;
  target: number;
  increase: number;
};

export function buildBaselineQuotaTable(maxQuotaNumber: number): QuotaTableRow[] {
  const safeMax = normalizeQuotaNumber(maxQuotaNumber);
  const rows: QuotaTableRow[] = [];

  for (let quotaNumber = 1; quotaNumber <= safeMax; quotaNumber += 1) {
    const target = estimateQuotaValue(quotaNumber, 1);
    rows.push({
      quotaNumber,
      target,
      increase: quotaNumber === 1 ? 0 : target - rows[rows.length - 1].target,
    });
  }

  return rows;
}
