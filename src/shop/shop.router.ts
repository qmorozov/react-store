import { Route } from '../app/router/route';

export class ShopRoute extends Route {
  static readonly controller = 'shop';
  entries = ['shop/client/shop.client.tsx'];
}

export class AddShopRoute extends ShopRoute {
  static readonly path = 'manage';

  entries = ['shop/client/manageShop.client.tsx'];
}
