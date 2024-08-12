import { PricingPeriod } from './PricingPeriod.enum';

export abstract class PricingPlanPeriods {
  price_month: number;
  price_year: number;
}

export function getPeriodPriceName(period: PricingPeriod): keyof PricingPlanPeriods {
  return `price_${period}`;
}

export function getPeriodDays(period: PricingPeriod): number {
  switch (period) {
    case PricingPeriod.Month:
      return 30;
    case PricingPeriod.Year:
      return 365;
  }
}

export function getPeriodMilliseconds(period: PricingPeriod): number {
  return getPeriodDays(period) * 24 * 60 * 60 * 1000;
}
