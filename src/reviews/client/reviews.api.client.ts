import { ApiService } from '../../app/services/api.service.client';
import { AccountServiceClient } from '../../user/client/account.service.client';

export abstract class ReviewsApi extends ApiService {
  static async getReviewsForMe() {
    return (
      await this.url('/reviews/list/forme', {
        shop: AccountServiceClient.getShopUuid(),
      }).get()
    )?.data;
  }

  static async getReviewsMine() {
    return (
      await this.url('/reviews/list/mine', {
        shop: AccountServiceClient.getShopUuid(),
      }).get()
    )?.data;
  }
}
