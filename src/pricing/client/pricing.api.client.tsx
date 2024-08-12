import { ApiService } from '../../app/services/api.service.client';
import { AccountServiceClient } from '../../user/client/account.service.client';

export abstract class PricingApi extends ApiService {
  static async getPricingPlan() {
    return (
      await this.url('/pricing/plans', {
        shop: AccountServiceClient.getShopUuid(),
      }).get()
    )?.data;
  }

  static async buyPricingPlan(id: number, period: any, shopId?: string | undefined) {
    let url = '/pricing/plan';
    if (shopId) {
      url += `?shop=${shopId}`;
    }
    return (await this.url(url).post({ id, period }))?.data;
  }

  static async getPricingPayment(payment_intent_client_secret: string, payment_intent: string) {
    return this.url('/pricing/payment')
      .get({ payment_intent_client_secret, payment_intent })
      .then((r) => r.data);
  }

  static async getCurrentPlan(uuid?: string) {
    if (uuid) {
      const response = await this.url(`/pricing/current?shop=${uuid}`).get();
      return response.data;
    } else {
      const response = await this.url('/pricing/current').get();
      return response.data;
    }
  }
}
