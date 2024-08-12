import { Route } from '../app/router/route';

export class CatalogRoute extends Route {
  static readonly controller = 'catalog';

  static forUser() {
    return new CatalogRoute().setClientEntry('catalog/client/catalog.client.tsx');
  }

  static forShop() {
    return new CatalogRoute().setClientEntry('catalog/client/catalog.client.tsx');
  }
}
