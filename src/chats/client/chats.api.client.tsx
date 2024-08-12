import { ApiService } from '../../app/services/api.service.client';
import { AccountServiceClient } from '../../user/client/account.service.client';

export abstract class ChatsApi extends ApiService {
  static async getChatsList() {
    return (
      await this.url('/chats', {
        shop: AccountServiceClient.getShopUuid(),
      }).get()
    )?.data;
  }

  static async getChat(uuid: string) {
    return (
      await this.url(`/chats/${uuid}`, {
        shop: AccountServiceClient.getShopUuid(),
      }).get()
    )?.data;
  }

  static async sendMessage(data: FormData, uuid: string) {
    return (
      await this.url(`/chats/${uuid}`, {
        shop: AccountServiceClient.getShopUuid(),
      }).post(data)
    )?.data;
  }

  static safeJsonParse(data: string) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }

  static subscribeChatUpdates(callback: (error, event?: any) => void) {
    const eventSource = new EventSource(
      ChatsApi.makeUrl('/chats/updates', {
        shop: AccountServiceClient.getShopUuid(),
      }),
      {
        withCredentials: true,
      },
    );
    eventSource.onmessage = (e) => callback(null, this.safeJsonParse(e.data));
    eventSource.onerror = (e) => callback(e);
    return eventSource;
  }
}
