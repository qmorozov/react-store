import { Injectable } from '@nestjs/common';
import { Product } from '../../product/models/Product.abstract';
import { CurrentUser } from '../../auth/models/CurrentUser';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { EntityManager, Repository } from 'typeorm';
import { ProductCart } from '../model/ProductCart';
import { ProductSharedService } from '../../product/service/product.shared.service';
import { ActionTargetKey, iActionTarget } from '../../user/decorator/action.target.decorator';
import { SuggestPriceStatus } from '../model/SuggestPriceStatus.enum';
import { BulkCollect } from '../../app/services/bulk-collect';
import { PreCheckout } from '../model/PreCheckout';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(ProductCart, Database.Main) private cartRepository: Repository<ProductCart>,
    @InjectEntityManager(Database.Main) private entityManager: EntityManager,
    private readonly productSharedService: ProductSharedService,
  ) {}

  async get(product: Product<any>, user: CurrentUser) {
    return this.getByProductId(product.id, user);
  }

  async getById(id: number) {
    return this.cartRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async getSuggestedByProductOwnerTarget(owner: iActionTarget) {
    return this.cartRepository
      .createQueryBuilder('cart')
      .distinct(true)
      .where('cart.suggestedPrice IS NOT NULL')
      .andWhere('cart.suggestedStatus != :status', { status: SuggestPriceStatus.Deleted })
      .innerJoin(
        this.entityManager.getRepository(Product).metadata.givenTableName,
        'product',
        'product.id = cart.productId AND product.ownerType = :ownerType AND product.ownerId = :ownerId',
        {
          ownerType: owner.type,
          ownerId: owner.id,
        },
      )
      .getMany();
  }

  async getCartByUserIdAndSellerTarget(userId: number | string, owner: iActionTarget) {
    return this.cartRepository
      .createQueryBuilder('cart')
      .distinct(true)
      .where('cart.userId = :userId', { userId: Number(userId) })
      .andWhere('cart.suggestedPrice IS NULL')
      .innerJoin(
        this.entityManager.getRepository(Product).metadata.givenTableName,
        'product',
        'product.id = cart.productId AND product.ownerType = :ownerType AND product.ownerId = :ownerId',
        {
          ownerType: owner.type,
          ownerId: owner.id,
        },
      )
      .getMany();
  }

  async getByProductId(productId: Product<any>['id'], user: CurrentUser) {
    return this.cartRepository.findOne({
      where: {
        userId: user.id,
        productId: productId,
      },
    });
  }

  async getProductForCartItem(cartItem: ProductCart) {
    return this.productSharedService.getProductById(cartItem.productId);
  }

  async remove(product: Product<any>, user: CurrentUser) {
    return this.removeByProductId(product.id, user);
  }

  async removeByProductId(productId: Product<any>['id'], user: CurrentUser) {
    return this.cartRepository
      .delete({
        userId: user.id,
        productId: productId,
      })
      .catch(() => false);
  }

  async getOrCreate(product: Product<any>, user: CurrentUser): Promise<ProductCart> {
    const cart = await this.get(product, user);
    if (!cart) {
      return ProductCart.add(product, user);
    }
    return cart;
  }

  async save(productInCart: ProductCart) {
    return this.cartRepository.save(productInCart);
  }

  private async getCartItemsForUserBuilder(user: CurrentUser) {
    const cartQueryBuilder = this.cartRepository.createQueryBuilder();
    return cartQueryBuilder
      .where(`${cartQueryBuilder.alias}.userId = :userId and ${cartQueryBuilder.alias}.suggestedPrice is NULL`, {
        userId: user.id,
      })
      .innerJoin('products', 'products', `products.id = ${cartQueryBuilder.alias}.productId`)
      .andWhere(`products.status = :status`, { status: this.productSharedService.productShowStatus })
      .andWhere(`products.quantity >= ${cartQueryBuilder.alias}.quantity`);
  }

  async getCartItemsCount(user: CurrentUser): Promise<number> {
    if (!user?.id) {
      return 0;
    }

    const cartForUser = await this.getCartItemsForUserBuilder(user);
    const cartResult = await cartForUser
      .select('COUNT(*)', 'count')
      .groupBy(`${cartForUser.alias}.userId`)
      .getRawOne()
      .catch(() => ({ count: 0 }));

    console.log(cartResult);

    return Number(cartResult?.count) || 0;
  }

  async prepareProductInfoForCart(cart: ProductCart[], checkSuggestions = false) {
    if (!cart?.length) {
      return [];
    }

    await new BulkCollect(cart, 'productId')
      .collect((ids) => this.productSharedService.getActiveProductsByIds(ids))
      .then((collection) => collection.attach(cart, 'product'));

    return cart.filter((item) => {
      if (item?.product && this.productSharedService.canBuyProduct(item.product, item.quantity)) {
        return checkSuggestions ? !item?.suggestedPrice || item?.status === SuggestPriceStatus.Accepted : true;
      }
      return false;
    });
  }

  async getCart(currentUser: CurrentUser) {
    if (!currentUser?.id) {
      return [];
    }

    const cartForUser = await this.getCartItemsForUserBuilder(currentUser);

    return cartForUser
      .getMany()
      .catch(() => [] as ProductCart[])
      .then((cart) => this.prepareProductInfoForCart(cart))
      .then(async (productsOnCart) => {
        if (!productsOnCart?.length) {
          return [];
        }

        await Promise.all(
          productsOnCart.map(async (item) => {
            item.product.$isFavorite = await this.productSharedService.isFavorite(item.product, currentUser);
          }),
        );

        const cartByOwners = Array.from(
          productsOnCart
            .reduce((a, c) => {
              const target = new ActionTargetKey(c.product.ownerId, c.product.ownerType);
              const targetKey = target.toString();
              if (!a.has(targetKey)) {
                a.set(targetKey, {
                  target,
                  products: [],
                });
              }

              const current = a.get(targetKey);
              current.products.push(c);
              a.set(targetKey, current);
              return a;
            }, new Map())
            .values(),
        );

        const orders = await Promise.all(
          cartByOwners.map(async (cart) => {
            const checkout = new PreCheckout(cart.products);
            return checkout.forSeller(await this.productSharedService.ownerInfo(cart.target));
          }),
        );

        return {
          count: orders.reduce((a, c) => a + c.productsCount, 0),
          orders,
        };
      });
  }
}
