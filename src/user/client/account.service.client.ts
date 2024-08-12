import { CurrentUser } from './user.service.client';
import { ProductOwner } from '../../product/models/Product.owner.enum';

export class AccountServiceClient {
  private static _storage = 'account';

  private static user = CurrentUser;

  private static shops = CurrentUser.shops;

  static get() {
    if (typeof localStorage === 'undefined') return AccountServiceClient.user;

    const saved = localStorage.getItem(AccountServiceClient._storage);

    if (!saved || AccountServiceClient.user?.uuid === saved) {
      return AccountServiceClient.user;
    }

    return (AccountServiceClient.shops || []).find((shop) => shop?.uuid === saved) || AccountServiceClient.user;
  }

  static list() {
    return [AccountServiceClient.user, ...(AccountServiceClient.shops || [])];
  }

  static getByUuid(uuid: string) {
    if (uuid === AccountServiceClient.user?.uuid) return AccountServiceClient.user;
    return (AccountServiceClient.shops || []).find((shop) => shop?.uuid === uuid);
  }

  static getShopUuid() {
    const account = AccountServiceClient.get();
    return account.type === ProductOwner.Shop ? account.uuid : undefined;
  }

  static async set(uuid: string) {
    if (typeof localStorage === 'undefined') return;
    const selected = AccountServiceClient.getByUuid(uuid);
    if (selected) {
      localStorage.setItem(AccountServiceClient._storage, uuid);
    }
    return selected;
  }
}
