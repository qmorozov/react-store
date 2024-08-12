import { ApiService } from '../../app/services/api.service.client';

export abstract class SavedApi extends ApiService {
  static async getSaved(shopUuid?: string | null) {
    let url = '/saved';

    if (shopUuid) {
      url += `?shop=${shopUuid}`;
    }

    return (await this.url(url).get())?.data;
  }

  static async removeFromSaved(id: string) {
    return (await this.url(`/saved/${id}`).delete())?.data;
  }
}
