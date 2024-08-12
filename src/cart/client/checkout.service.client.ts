import { ApiService } from '../../app/services/api.service.client';
import { CheckoutDtoValidator } from '../dto/checkout.dto.validator';

export class CheckoutApi extends ApiService {
  static async getCheckoutPrepare(sellerId: string, sellerType: number) {
    return this.url(`/cart/checkout/prepare`)
      .get({
        sellerId,
        sellerType,
      })
      .catch(() => ({
        data: {
          count: 0,
          orders: [],
        },
      }))
      .then((r) => r.data);
  }

  static async getShipping(sellerId: string, sellerType: number) {
    return this.url(`/cart/checkout/shipping`)
      .get({
        sellerId,
        sellerType,
      })
      .then((r) => r.data);
  }

  static async postOrder(sellerId: string, sellerType: number, data) {
    return this.url(`/cart/orders`)
      .post(data, { sellerId, sellerType })
      .then((r) => r.data);
  }
}
