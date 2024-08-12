import { Route } from '../app/router/route';

export class ProductRoute extends Route {
  static readonly controller = 'product';

  entries = ['product/client/product.client.tsx'];
}

export class ManageProductRoute extends ProductRoute {
  static readonly path = 'manage';

  entries = ['product/client/manageProduct.client.tsx'];
}
