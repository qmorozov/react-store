import { Controller, Get, NotFoundException, Post, Query } from '@nestjs/common';
import { PricingRoute } from '../pricing.router';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Page } from '../../pages';
import { Lang } from '../../app/language/language.decorator';
import { LanguageCode } from '../../app/language/translation.provider';
import { PlansService } from '../service/plans.service';
import { SetPlanDto } from '../dto/setPlan.dto';
import { DTO } from '../../app/validation/validation.http';
import { setPlanDtoValidation } from '../dto/setPlan.dto.validation';
import { UserSignedOnly } from '../../auth/decorator/auth.decorators';
import { ActionTarget, iActionTarget } from '../../user/decorator/action.target.decorator';
import { AppResponse } from '../../app/services/response';
import { PaymentService } from '../../payment/service/payment.service';
import { isValidPrice } from '../../payment/model/price';
import { PaymentStatusQuery } from '../../payment/dto/payment.status.query';
import { ProductService } from '../../product/service/product.service';

@Controller(PricingRoute.apiController)
export class PricingApiController {
  constructor(
    private readonly plansService: PlansService,
    private readonly paymentService: PaymentService,
    private readonly productsService: ProductService,
  ) {}

  @Get('current')
  @ApiTags(Page.Pricing)
  @UserSignedOnly()
  async getPlan(@Lang() lang: LanguageCode, @ActionTarget() target: iActionTarget) {
    if (!target?.id) {
      return AppResponse.throwBadRequest('No target found');
    }

    const plan = await this.plansService.getCurrentPlan(target);

    if (!plan) {
      return AppResponse.throwBadRequest('No plan found');
    }

    return {
      subscription: plan?.setLanguage(lang).toJson(),
      current: {
        products: await this.productsService.countProductsByOwner(target),
      },
      plan: plan && (await this.plansService.getPlan(plan.planId))?.setLanguage(lang).toJson(),
    };
  }

  @Get('plans')
  @ApiTags(Page.Pricing)
  async getPlans(@Lang() lang: LanguageCode) {
    return this.plansService.getPlans().then((plans) => plans.map((p) => p.setLanguage(lang).toJson()));
  }

  @Post('plan')
  @ApiTags(Page.Pricing)
  @UserSignedOnly()
  @ApiBody({ type: SetPlanDto })
  @ApiQuery({ name: 'shop', required: false })
  async attachPlan(@DTO(setPlanDtoValidation) setPlanDto: SetPlanDto, @ActionTarget() target: iActionTarget) {
    if (!target?.id) {
      return AppResponse.throwBadRequest('No target found');
    }

    const selectedPlan = setPlanDto?.id ? await this.plansService.getPlanForTarget(setPlanDto?.id, target) : null;

    if (!selectedPlan) {
      return AppResponse.throwBadRequest('No plan found');
    }

    const selectedPlanPrice = await selectedPlan.getPrice(setPlanDto.period);

    if (!isValidPrice(selectedPlanPrice)) {
      return AppResponse.throwBadRequest('Bad plan period');
    }

    const payment = await this.paymentService.buyPlan(selectedPlanPrice);

    await this.plansService.preparePlan(selectedPlan, target, setPlanDto.period, payment);

    return payment.getUICredentials();
  }

  @Get(`payment`)
  @ApiTags(Page.Pricing)
  @ApiQuery({ name: 'payment_intent', required: true })
  @ApiQuery({ name: 'payment_intent_client_secret', required: true })
  async viewPayment(@Query() query: PaymentStatusQuery, @Lang() lang: LanguageCode) {
    const payment = await this.paymentService.revalidatePayment(
      query.payment_intent,
      query.payment_intent_client_secret,
    );

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const subscription = await this.plansService.revalidatePlanByPayment(payment);

    return {
      payment: payment?.setLanguage(lang).toJson(),
      subscription: subscription?.setLanguage(lang)?.toJson(),
    };
  }
}
