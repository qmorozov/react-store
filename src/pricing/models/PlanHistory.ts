import { Model } from '../../app/models/entity-helper';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import TableName from '../../app/database/tables.json';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { PlanStatus } from './PlanStatus.enum';
import { Payment } from '../../payment/model/Payment';
import { PricingPlan } from './PricingPlan';
import { iActionTarget } from '../../user/decorator/action.target.decorator';
import { PricingPeriod } from './PricingPeriod.enum';
import { PricingPlanLimits } from './PricingPlanLimits.abstract';
import { getPeriodMilliseconds } from './PricingPlanPeriod.abstract';

@Entity({
  name: TableName.PlanHistory,
})
export class PlanHistory extends Model {
  static public = ['id', 'status', 'type', 'foreignId', 'planId', 'period', 'startedAt', 'until'];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    enum: PlanStatus,
    default: PlanStatus.Disabled,
  })
  status: PlanStatus;

  @Column({
    nullable: false,
    enum: ProductOwner,
  })
  type: ProductOwner;

  @Column({
    nullable: false,
  })
  foreignId: number;

  @Column({
    nullable: false,
  })
  planId: number;

  @Column({
    nullable: false,
    enum: PricingPeriod,
    default: PricingPeriod.Month,
  })
  period: PricingPeriod;

  @Column({
    nullable: true,
    default: null,
  })
  startedAt: Date | null;

  @Column({
    nullable: true,
    default: null,
  })
  until: Date | null;

  @OneToOne(() => Payment)
  @JoinColumn()
  payment: Payment | null;

  @Column('int')
  paymentId!: number;

  @Column({
    nullable: true,
    default: null,
  })
  features: string;

  static create(plan: PricingPlan, target: iActionTarget, period: PricingPeriod): PlanHistory {
    const history = new PlanHistory();
    history.type = target.type;
    history.foreignId = target.id as number;
    history.planId = plan.id;
    history.period = period;
    const features: PricingPlanLimits = {
      max_products: plan.max_products,
      max_shops: plan.max_shops,
      max_product_images: plan.max_product_images,
    };
    history.features = JSON.stringify(features);
    return history;
  }

  getTarget(): iActionTarget {
    return {
      type: this.type,
      id: this.foreignId,
    };
  }

  getMillisecondsLeft(): number {
    return this.until.getTime() - Date.now();
  }

  getMillisecondsCost(price: number): number {
    return price / getPeriodMilliseconds(this.period);
  }

  getMoneyLeft(price: number): number {
    if (!price || !this.until) {
      return 0;
    }
    return this.getMillisecondsCost(price) * this.getMillisecondsLeft();
  }

  attachPeriod(): this {
    if (!this.startedAt) {
      this.startedAt = new Date();
    }

    this.until = new Date(this.startedAt.getTime() + getPeriodMilliseconds(this.period));
    return this;
  }
}
