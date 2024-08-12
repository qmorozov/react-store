import { Controller } from '@nestjs/common';
import { RenderService } from '../../app/render/render.service';
import { PaymentRoute } from '../payment.router';
import { PaymentService } from '../service/payment.service';

@Controller(PaymentRoute.controller)
export class PaymentController {
  constructor(private readonly renderService: RenderService, private readonly paymentService: PaymentService) {}
}
