import { ApiService } from '../../app/services/api.service.client';
import { OrderInfoDtoValidation } from '../dto/orderInfo.dtao.validation';

export class OrderInfoApi extends ApiService {
  static async getOrder(orderId: string) {
    return this.url(`/cart/orders/${orderId}`)
      .get()
      .then((r) => r.data);
  }

  static async getOrderInfo(orderId: string) {
    return this.url(`/reviews/order/${orderId}`)
      .get()
      .then((r) => r.data);
  }

  static async addOrderReview(orderId: number, data: any) {
    return (await this.url(`/reviews/order/${orderId}`).post(data))?.data;
  }
}
