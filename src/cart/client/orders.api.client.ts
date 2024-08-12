import { ApiService } from '../../app/services/api.service.client';
import { AccountServiceClient } from '../../user/client/account.service.client';

export abstract class OrdersApi extends ApiService {
  static async getSellingOrders() {
    return (
      await this.url('/cart/orders/list/selling', {
        shop: AccountServiceClient.getShopUuid(),
      }).get()
    )?.data;
  }

  static async getBuyingOrders() {
    return (
      await this.url('/cart/orders/list/buying', {
        shop: AccountServiceClient.getShopUuid(),
      }).get()
    )?.data;
  }
}
