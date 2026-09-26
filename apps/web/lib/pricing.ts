export type AnnotationType =
  | 'classification'
  | 'bbox'
  | 'keypoint'
  | 'polygon'
  | 'segmentation';

export type TurnaroundSpeed = 'standard' | 'priority' | 'rush';

export interface PricingRatesConfig {
  baseRates: Record<AnnotationType, number>;
  labelMultipliers: Record<AnnotationType, number>;
  volumeDiscountTiers: Array<{ minLabels: number; discount: number; label: string }>;
  turnaroundSurcharges: Record<TurnaroundSpeed, { surcharge: number; label: string; days: number }>;
}

export const PRICING_RATES: PricingRatesConfig = {
  baseRates: {
    classification: 1.5,
    bbox: 5.0,
    keypoint: 8.0,
    polygon: 12.0,
    segmentation: 18.0,
  },
  labelMultipliers: {
    classification: 1,
    bbox: 6,
    keypoint: 6,
    polygon: 6,
    segmentation: 6,
  },
  volumeDiscountTiers: [
    { minLabels: 250000, discount: 0.2, label: '20%' },
    { minLabels: 100000, discount: 0.15, label: '15%' },
    { minLabels: 50000, discount: 0.1, label: '10%' },
    { minLabels: 25000, discount: 0.06, label: '6%' },
    { minLabels: 0, discount: 0.0, label: '0%' },
  ],
  turnaroundSurcharges: {
    standard: { surcharge: 0.0, label: 'Standard · 14 days', days: 14 },
    priority: { surcharge: 0.2, label: 'Priority · 7 days', days: 7 },
    rush: { surcharge: 0.45, label: 'Rush · 3 days', days: 3 },
  },
};

export interface QuoteCalculation {
  images: number;
  labels: number;
  type: AnnotationType;
  turnaround: TurnaroundSpeed;
  baseRate: number;
  baseCost: number;
  discountRate: number;
  discountAmount: number;
  discountLabel: string;
  turnaroundRate: number;
  turnaroundAmount: number;
  totalCost: number;
}

export function calculateQuote(
  type: AnnotationType,
  images: number,
  turnaround: TurnaroundSpeed
): QuoteCalculation {
  const multiplier = PRICING_RATES.labelMultipliers[type];
  const labels = images * multiplier;
  const baseRate = PRICING_RATES.baseRates[type];
  const baseCost = Math.round(labels * baseRate);

  // Volume discount based on label count
  let discountRate = 0;
  let discountLabel = '0%';
  for (const tier of PRICING_RATES.volumeDiscountTiers) {
    if (labels >= tier.minLabels) {
      discountRate = tier.discount;
      discountLabel = tier.label;
      break;
    }
  }
  const discountAmount = Math.round(baseCost * discountRate);

  // Turnaround surcharge applied to base
  const turnaroundConfig = PRICING_RATES.turnaroundSurcharges[turnaround];
  const turnaroundRate = turnaroundConfig.surcharge;
  const turnaroundAmount = Math.round(baseCost * turnaroundRate);

  const totalCost = baseCost + turnaroundAmount - discountAmount;

  return {
    images,
    labels,
    type,
    turnaround,
    baseRate,
    baseCost,
    discountRate,
    discountAmount,
    discountLabel,
    turnaroundRate,
    turnaroundAmount,
    totalCost,
  };
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
