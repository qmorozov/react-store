import { ApiService } from '../../app/services/api.service.client';

export abstract class CatalogApi extends ApiService {
  static async getFilterInfo(productType: string) {
    return (await this.url(`/catalog/filters/${productType || 'global'}`).get())?.data || {};
  }
}
