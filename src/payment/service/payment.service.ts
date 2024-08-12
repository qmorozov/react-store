import { Injectable } from '@nestjs/common';
import { Currency } from '../model/currency.enum';
import environment from '../../app/configuration/configuration.env';
import Stripe from 'stripe';
import { Payment } from '../model/Payment';
import { Price } from '../model/price';
import { OrderType } from '../model/order-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  private readonly client: Stripe;

  constructor(@InjectRepository(Payment, Database.Main) private paymentsRepository: Repository<Payment>) {
    this.client = (Stripe as unknown as (apiKey: string) => Stripe)(environment.stripe.secretKey);
  }

  async findPayment(paymentIntent: string, paymentClientSecret: string): Promise<Payment> {
    return this.paymentsRepository.findOne({
      where: {
        paymentIntent,
        paymentClientSecret,
      },
    });
  }

  async revalidatePayment(paymentIntent: string, paymentClientSecret: string): Promise<Payment> {
    if (!paymentIntent?.length || !paymentClientSecret?.length) {
      return null;
    }

    const payment = await this.findPayment(paymentIntent, paymentClientSecret);

    if (payment && !payment.isFinal()) {
      const servicePayment = await this.client.paymentIntents.retrieve(paymentIntent);
      payment.updateStatus(servicePayment.status);
      if (payment.statusChanged) {
        return this.paymentsRepository.save(payment);
      }
    }
    return payment;
  }

  private async makePayment(type: OrderType, amount: number, currency: Currency = Currency.USD): Promise<Payment> {
    const payment = new Payment(type, amount, currency);

    const servicePayment = await this.client.paymentIntents.create({
      amount: amount * 100,
      currency,
    });

    payment.paymentIntent = servicePayment.id;
    payment.paymentClientSecret = servicePayment.client_secret;
    payment.paymentStatus = servicePayment.status;

    return this.paymentsRepository.save(payment);
  }

  async buyPlan(price: Price): Promise<Payment> {
    return this.makePayment(OrderType.Plan, price.amount, price.currency);
  }

  async getPayment(paymentId: number) {
    return this.paymentsRepository.findOne({
      where: {
        id: paymentId,
      },
    });
  }
}
