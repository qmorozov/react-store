import { Injectable } from '@nestjs/common';
import { iActionTarget } from '../../user/decorator/action.target.decorator';
import { CartService } from '../../cart/service/cart.service';
import { ProductCart } from '../../cart/model/ProductCart';
import { BulkCollect } from '../../app/services/bulk-collect';
import { ProductSharedService } from '../../product/service/product.shared.service';
import { UsersService } from '../../user/service/users.service';
import { SuggestPriceStatus } from '../../cart/model/SuggestPriceStatus.enum';
import { OrdersService } from '../../cart/service/orders.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly cartService: CartService,
    private readonly ordersService: OrdersService,
    private readonly productSharedService: ProductSharedService,
    private readonly usersService: UsersService,
  ) {}

  async getFeedForTarget(target: iActionTarget) {
    return Promise.all(
      Object.entries({
        order: this.ordersService
          .getOrdersBySellerId(target)
          .catch(() => [])
          .then((orders) =>
            Promise.all([
              this.ordersService.attachProductsToOrders(orders),
              this.ordersService.attachUsersToOrders(orders),
            ]).then(() => orders),
          ),
        suggestPrice: this.cartService
          .getSuggestedByProductOwnerTarget(target)
          .catch(() => [])
          .then((cart) =>
            Promise.all([this.attachUsersToFeed(cart), this.attachProductsToFeed(cart)]).then(() =>
              (cart || []).filter((i) => i.product && i.user),
            ),
          ),
      }).map(([id, getter]) =>
        getter.then((r) => ({
          id,
          data: r,
        })),
      ),
    ).then((res) => {
      // todo sort by date
      // todo filter
      return (res || []).flatMap((typeItems) =>
        (typeItems.data || []).map((j) => {
          return {
            type: typeItems.id,
            data: j?.toJson?.(),
          };
        }),
      );
    });
  }

  private async attachUsersToFeed(feed: ProductCart[]) {
    return new BulkCollect(feed, 'userId')
      .collect((ids) => this.usersService.getActiveUsersByIds(ids))
      .then((collection) => collection.attach(feed, 'user'));
  }

  private async attachProductsToFeed(feed: ProductCart[]) {
    return new BulkCollect(feed, 'productId')
      .collect((ids) => this.productSharedService.getActiveProductsByIds(ids))
      .then((collection) => collection.attach(feed, 'product'));
  }

  async getFeedItemById(id: number) {
    return this.cartService.getById(id).then((cart) => {
      return (cart?.suggestedPrice && cart) || null;
    });
  }

  changeStatus(cartItem: ProductCart, nextStatus: SuggestPriceStatus) {
    cartItem.status = nextStatus;
    return this.cartService.save(cartItem);
  }
}
