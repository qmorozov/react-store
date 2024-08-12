import { Controller, Get, NotFoundException, Query, Res } from '@nestjs/common';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';
import { PricingRoute } from '../pricing.router';
import { PaymentStatusQuery } from '../../payment/dto/payment.status.query';
import { PaymentService } from '../../payment/service/payment.service';
import { PlansService } from '../service/plans.service';
import { AppResponse } from '../../app/models/request';

@Controller(PricingRoute.controller)
export class PricingController {
  constructor(
    private readonly renderService: RenderService,
    private readonly paymentService: PaymentService,
    private readonly plansService: PlansService,
  ) {}

  @Get()
  @ApiTags(ApiType.Pages, Page.Pricing)
  async view(@Res() response: Response, @Query() query: any) {
    await this.revalidateFromQuery(query as PaymentStatusQuery);
    return this.renderService.renderOnClient(response, Page.Pricing);
  }

  @Get(`/payment`)
  @ApiTags(ApiType.Pages, Page.Pricing)
  // @deprecated
  async viewPayment(@Res() response: AppResponse, @Query() query: PaymentStatusQuery) {
    await this.revalidateFromQuery(query as PaymentStatusQuery);
    return response.redirectTo(
      `/pricing?payment_intent=${query.payment_intent}&payment_intent_client_secret=${query.payment_intent_client_secret}`,
    );
  }

  private async revalidateFromQuery(query: PaymentStatusQuery) {
    if (query.payment_intent?.length && query.payment_intent_client_secret?.length) {
      const payment = await this.paymentService.revalidatePayment(
        query.payment_intent,
        query.payment_intent_client_secret,
      );

      const nextPlan = payment ? await this.plansService.revalidatePlanByPayment(payment) : undefined;

      if (!nextPlan) {
        throw new NotFoundException();
      }
    }
    return query;
  }
}
