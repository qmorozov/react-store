import { Model } from '../../app/models/entity-helper';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { PricingPlanPeriods } from '../models/PricingPlanPeriod.abstract';
import { PricingPlanLimits } from '../models/PricingPlanLimits.abstract';

const PricingCreateDtoPeriods: Record<keyof PricingPlanPeriods, any> = {
  price_month: {
    type: 'number',
  },
  price_year: {
    type: 'number',
  },
};

const PricingCreateDtoLimits: Record<keyof PricingPlanLimits, any> = {
  max_products: {
    type: 'number',
  },
  max_shops: undefined,
  max_product_images: undefined,
};

export const PricingCreateDto = {
  type: 'object',
  properties: {
    ...Model.langSchemaProperty('title'),
    ...Model.langSchemaProperty('description'),
    type: {
      type: 'enum',
      description: 'Product owner type',
      enum: [ProductOwner.Shop, ProductOwner.User],
    },
    ...PricingCreateDtoPeriods,
    ...Object.entries(PricingCreateDtoLimits).reduce((a, [k, v]) => {
      if (v) {
        a[k] = v;
      }
      return a;
    }, {}),
  },
};
