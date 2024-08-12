import { ApiService } from '../../app/services/api.service.client';
import { AccountServiceClient } from '../../user/client/account.service.client';

export abstract class FeedApi extends ApiService {
  static async getFullFeed() {
    return (
      await this.url('/feed/full', {
        shop: AccountServiceClient.getShopUuid(),
      }).get()
    )?.data;
  }

  static async removeFeed(id: number) {
    return (await this.url(`/feed/${id}`).delete())?.data;
  }

  static async setFeedStatus(id: number, status: string) {
    return await this.url(`/feed/${id}/${status}`).post();
  }
}
