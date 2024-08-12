import { ApiService } from '../../app/services/api.service.client';

export abstract class FAQApi extends ApiService {
  static async getFaq() {
    return (await this.url('/faq').get())?.data;
  }
}
