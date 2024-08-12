import { ProductOwner } from '../../product/models/Product.owner.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import TableName from '../../app/database/tables.json';
import { ColumnFromTranslations } from '../../app/database/database.decorators';
import { Model } from '../../app/models/entity-helper';
import { Currency } from '../../payment/model/currency.enum';
import { PricingPeriod } from './PricingPeriod.enum';
import { Price } from '../../payment/model/price';
import { getPeriodPriceName, PricingPlanPeriods } from './PricingPlanPeriod.abstract';
import { PricingPlanLimits } from './PricingPlanLimits.abstract';

@Entity({
  name: TableName.Plans,
})
export class PricingPlan extends Model implements PricingPlanPeriods, PricingPlanLimits {
  static public = [
    'id',
    'type',
    'title',
    'description',
    'price_month',
    'price_year',
    'currency',
    'max_products',
    'max_shops',
    'max_product_images',
  ];

  static fillable = [
    'type',
    ...Model.langCol('title'),
    ...Model.langCol('description'),
    'price_month',
    'price_year',
    'max_products',
  ];

  static default(type: ProductOwner): PricingPlan {
    const defaults: PricingPlanLimits & { status: true; type: ProductOwner } = {
      max_products: 0,
      max_shops: 1,
      max_product_images: 1,
      status: true,
      type,
    };
    return Object.assign(new PricingPlan(), defaults);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title_en: string;

  @ColumnFromTranslations<PricingPlan>({
    en: 'title_en',
  })
  title: string;

  @Column()
  description_en: string;

  @ColumnFromTranslations<PricingPlan>({
    en: 'description_en',
  })
  description: string;

  @Column()
  active: boolean;

  @Column({
    type: 'enum',
    enum: ProductOwner,
    default: ProductOwner.User,
  })
  type: ProductOwner;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  price_month: number;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  price_year: number;

  @Column({
    nullable: false,
    default: Currency.USD,
  })
  currency: Currency = Currency.USD;

  @Column()
  max_products: number;

  max_shops = 1;

  max_product_images = 10;

  async getPrice(period: PricingPeriod): Promise<Price> {
    return {
      amount: this[getPeriodPriceName(period)],
      currency: this.currency,
    };
  }
}
