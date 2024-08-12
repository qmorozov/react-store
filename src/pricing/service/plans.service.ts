import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { MoreThan, Repository } from 'typeorm';
import { PricingPlan } from '../models/PricingPlan';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { iActionTarget } from '../../user/decorator/action.target.decorator';
import { PlanHistory } from '../models/PlanHistory';
import { PricingPeriod } from '../models/PricingPeriod.enum';
import { Payment } from '../../payment/model/Payment';
import { PlanStatus } from '../models/PlanStatus.enum';
import { PaymentService } from '../../payment/service/payment.service';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(PricingPlan, Database.Main) private plansRepository: Repository<PricingPlan>,
    @InjectRepository(PlanHistory, Database.Main) private planHistoryRepository: Repository<PlanHistory>,
    private readonly paymentService: PaymentService,
  ) {}

  getPlans(type?: ProductOwner) {
    return this.plansRepository.find({
      where: {
        active: true,
        type,
      },
    });
  }

  async getPlan(planId: number) {
    return this.plansRepository.findOne({
      where: {
        id: planId,
      },
    });
  }

  async getPlanForTarget(planId: number, target: iActionTarget) {
    return this.plansRepository.findOne({
      where: {
        id: planId,
        type: target.type,
        active: true,
      },
    });
  }

  async getCurrentPlan(target: iActionTarget) {
    return this.planHistoryRepository.findOne({
      where: {
        type: target.type,
        foreignId: target.id as number,
        status: PlanStatus.Enabled,
        until: MoreThan(new Date()),
      },
    });
  }

  async getCurrentPricingPlan(target: iActionTarget, withDefault = true): Promise<PricingPlan> {
    return this.getCurrentPlan(target)
      .then((planHistory) => {
        return planHistory
          ? this.plansRepository.findOne({
              where: {
                id: planHistory.planId,
              },
            })
          : null;
      })
      .then((plan) => {
        return plan || (withDefault ? this.getDefaultPlan(target) : null);
      });
  }

  async getCurrentPlanForUser(userId: number) {
    return this.getCurrentPlan({ type: ProductOwner.User, id: userId });
  }

  async getCurrentPlanForShop(shopId: string) {
    return this.getCurrentPlan({ type: ProductOwner.Shop, id: shopId });
  }

  async getDefaultPlan(target: iActionTarget) {
    return PricingPlan.default(target.type);
  }

  async getDefaultPlanForUser(userId: number) {
    return this.getDefaultPlan({ type: ProductOwner.User, id: userId });
  }

  async getDefaultPlanForShop(shopId: string) {
    return this.getDefaultPlan({ type: ProductOwner.Shop, id: shopId });
  }

  async preparePlan(
    selectedPlan: PricingPlan,
    target: iActionTarget,
    period: PricingPeriod,
    payment: Payment | null = null,
  ): Promise<PlanHistory> {
    const prepared = PlanHistory.create(selectedPlan, target, period);
    prepared.payment = payment;
    return this.planHistoryRepository.save(prepared);
  }

  async getPlanByPaymentId(id: number): Promise<PlanHistory> {
    return this.planHistoryRepository.findOne({
      where: {
        payment: {
          id,
        },
      },
    });
  }

  private async getPlanPrice(paymentId: number, currentPlan: PlanHistory) {
    let price = 0;

    const payment = await this.paymentService.getPayment(paymentId);
    price = payment?.getAmount();

    if (!price) {
      const plan = await this.getPlan(currentPlan.planId);
      price = (await plan?.getPrice(currentPlan.period)).amount || 0;
    }

    return price;
  }

  async revalidatePlanByPayment(payment: Payment) {
    if (!payment) {
      return null;
    }

    const nextPlan = await this.getPlanByPaymentId(payment.id);

    if (!nextPlan) {
      return null;
    }

    if (payment?.statusChanged && payment.isSuccessful) {
      nextPlan.attachPeriod();
      const currentPlan = await this.getCurrentPlan(nextPlan.getTarget());

      if (currentPlan) {
        const currentPlanPrice = (await this.getPlanPrice(currentPlan.paymentId, currentPlan)) || 0;
        const moneyLeft = currentPlan?.getMoneyLeft(currentPlanPrice) || 0;
        if (moneyLeft) {
          const nextPeriodMillisecondCost = nextPlan.getMillisecondsCost(payment.getAmount());
          const addMilliseconds = Math.floor(moneyLeft / nextPeriodMillisecondCost);
          nextPlan.until = new Date(nextPlan.until.getTime() + addMilliseconds);
        }
      }

      await Promise.all([this.deactivate(currentPlan), this.activate(nextPlan)]);
    }

    return nextPlan;
  }

  async updatePlan(plan: PlanHistory) {
    return this.planHistoryRepository.save(plan);
  }

  async activate(plan: PlanHistory) {
    plan.status = PlanStatus.Enabled;
    return this.updatePlan(plan);
  }

  async deactivate(currentPlan: PlanHistory) {
    if (currentPlan) {
      currentPlan.status = PlanStatus.Disabled;
      currentPlan.until = new Date();
      return this.updatePlan(currentPlan);
    }
  }

  async getPlansList() {
    return this.plansRepository.find();
  }

  async savePlan(plan: PricingPlan) {
    return this.plansRepository.save(plan);
  }
}
