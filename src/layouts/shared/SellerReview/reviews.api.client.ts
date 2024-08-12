import { ApiService } from '../../../app/services/api.service.client';

export abstract class ReviewsApi extends ApiService {
  static async getReviews(sellerType: string, sellerUuid: string) {
    return (await this.url(`/reviews/${sellerType}/${sellerUuid}`).get())?.data || {};
  }
}
