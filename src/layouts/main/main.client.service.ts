import { ApiService } from '../../app/services/api.service.client';

export class MainLayoutServiceClient extends ApiService {
  static async searchSuggestion(query: string) {
    return this.url('/catalog/search-suggestions')
      .get({ query })
      .then((r) => r.data);
  }
}
