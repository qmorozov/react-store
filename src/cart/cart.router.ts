import { Route } from '../app/router/route';

export class CartRoute extends Route {
  static readonly controller = 'cart';
}

export class OrdersRoute extends CartRoute {
  static readonly path = `orders`;
  public entries = ['cart/client/orders.client.tsx'];
}

export class CheckoutRoute extends CartRoute {
  static readonly path = `checkout`;
  public entries = ['cart/client/checkout.client.tsx'];
}

export class OrderInfoRoute extends CartRoute {
  static readonly path = `order/:id`;
  public entries = ['cart/client/orderInfo.client.tsx'];
}
