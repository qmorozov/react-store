import { Product } from '../models/Product.abstract';
import { ProductOwner } from '../models/Product.owner.enum';
import { CurrentUser as CurrentUserType, CurrentUser } from '../../auth/models/CurrentUser';
import { FavoriteProduct } from '../models/FavoriteProduct';
import { EntityManager, In } from 'typeorm';
import { ProductCart } from '../../cart/model/ProductCart';
import { ProductOwnerModelByType } from '../models/ProductOwnerModelByType';
import { Shop } from '../../shop/models/Shop';
import { User } from '../../user/models/User';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { ProductStatus } from '../models/Product.status.enum';
import { ShopService } from '../../shop/service/shop.service';
import environment from '../../app/configuration/configuration.env';
import { ActionTargetKey, iActionTarget } from '../../user/decorator/action.target.decorator';
import { OwnerInfo } from '../models/OwnerInfo';
import { UsersService } from '../../user/service/users.service';

export class ProductSharedService {
  public readonly productShowStatus = environment.product.showStatus;

  constructor(
    @InjectEntityManager(Database.Main) private entityManager: EntityManager,
    private readonly shopService: ShopService,
    private readonly usersService: UsersService,
  ) {}

  collectOwners<I>(list: I[], type: keyof I, id: keyof I) {
    return list.reduce(
      (acc, li) => {
        acc[li[type] as ProductOwner].add(li[id]);
        return acc;
      },
      {
        [ProductOwner.User]: new Set(),
        [ProductOwner.Shop]: new Set(),
      },
    );
  }

  async loadOwners(ownersByType) {
    return Promise.all(
      Object.entries(ownersByType).map(([ownerType, owner]) =>
        this._getOwner(ownerType as unknown as ProductOwner, [...((owner || []) as any[])])
          .then((owners) =>
            ((owners || []) as any[]).reduce((a, c) => {
              a[c.id] = OwnerInfo.from(c);
              return a;
            }, {}),
          )
          .then((owners) => ({ [ownerType]: owners })),
      ),
    ).then((r) => Object.assign({}, ...r));
  }

  async attachOwner(products: Product<any>[], owner?: OwnerInfo) {
    if (!products?.length) {
      return products;
    }

    if (owner) {
      (products || []).forEach((product) => {
        product.$owner = owner;
      });
    } else {
      const ownersByType = this.collectOwners(products, 'ownerType', 'ownerId');

      const ownersByTypeIds = await this.loadOwners(ownersByType);

      (products || []).forEach((product) => {
        product.$owner = ownersByTypeIds[product.ownerType][product.ownerId];
      });
    }

    return products;
  }

  async attachCart(products: Product<any>[], user: CurrentUser) {
    if (user?.id && products?.length) {
      const cartIds = (
        (await this._isOnCart(
          products.map((p) => p.id),
          user.id,
        )) || []
      ).reduce((a, c) => {
        a[c.productId] = true;
        return a;
      }, {});

      (products || []).forEach((product) => {
        product.$onCart = !!cartIds[product.id];
      });
    }

    return products;
  }

  async attachFavorites(products: Product<any>[], user: CurrentUser) {
    if (user?.id && products?.length) {
      const favoritesIds = (
        (await this._isFavorite(
          products.map((p) => p.id),
          user.id,
        )) || []
      ).reduce((a, c) => {
        a[c.productId] = true;
        return a;
      }, {});

      (products || []).forEach((product) => {
        product.$isFavorite = !!favoritesIds[product.id];
      });
    }

    return products;
  }

  async isFavorite(showProduct: Product<any>, user: CurrentUser) {
    if (!user?.id || !showProduct?.id) {
      return false;
    }

    return this._isFavorite(showProduct.id, user.id)
      .then((favorite) => !!favorite)
      .catch(() => false);
  }

  async isOnCart(showProduct: Product<any>, user: CurrentUser) {
    if (!user?.id || !showProduct?.id) {
      return false;
    }

    return this._isOnCart(showProduct.id, user.id)
      .then((onCart) => !!onCart)
      .catch(() => false);
  }

  private getManagerMethod<T>(of: T | T[], ...args: Parameters<typeof this.entityManager.find>) {
    if (Array.isArray(of)) {
      return this.entityManager.find(...args);
    } else {
      return this.entityManager.findOne(...args);
    }
  }

  private async _isFavorite<ST = number | number[]>(
    productIds: ST,
    userId: number,
  ): Promise<ST extends Array<number> ? FavoriteProduct[] : FavoriteProduct> {
    if (!userId || !productIds || (Array.isArray(productIds) && !productIds.length)) {
      return (Array.isArray(productIds) ? [] : undefined) as undefined;
    }
    return this.getManagerMethod(productIds, FavoriteProduct, {
      where: {
        userId,
        productId: Array.isArray(productIds) ? In(productIds) : (productIds as number),
      },
    }) as Promise<ST extends Array<number> ? FavoriteProduct[] : FavoriteProduct>;
  }

  private async _isOnCart<ST = number | number[]>(
    productIds: ST,
    userId: number,
  ): Promise<ST extends Array<number> ? ProductCart[] : ProductCart> {
    if (!userId || !productIds || (Array.isArray(productIds) && !productIds.length)) {
      return (Array.isArray(productIds) ? [] : undefined) as undefined;
    }
    return this.getManagerMethod(productIds, ProductCart, {
      where: {
        userId,
        productId: Array.isArray(productIds) ? In(productIds) : (productIds as number),
      },
    }) as Promise<ST extends Array<number> ? ProductCart[] : ProductCart>;
  }

  private async _getOwner<ST = number | number[]>(ownerType: ProductOwner, ownerId: ST) {
    const ownerModel = !!ProductOwner[ownerType] && ProductOwnerModelByType[ownerType];

    if (!ownerId || !ownerModel || (Array.isArray(ownerId) && !ownerId.length)) {
      return (Array.isArray(ownerId) ? [] : undefined) as undefined;
    }

    return this.getManagerMethod(ownerId, ownerModel, {
      where: {
        id: Array.isArray(ownerId) ? In(ownerId) : (ownerId as number),
      },
    }).then((res) => {
      if (res) {
        if (!Array.isArray(res)) {
          return this.loadOwnerInfo(res as User | Shop);
        } else {
          return Promise.all((res || []).map((r) => this.loadOwnerInfo(r as User | Shop)));
        }
      }
      return res;
    }) as Promise<ST extends Array<number> ? (Shop | User)[] : Shop | User>;
  }

  async loadOwnerInfo<I extends User | Shop>(item: I): Promise<I> {
    item.$isOnline = await this.usersService.isOnline(ActionTargetKey.convert(item));
    return item;
  }

  async getActiveProductsByIds(ids: Product<any>['id'][]) {
    return this.getProductsByIds(ids, {
      status: ProductStatus.Published,
    });
  }

  async getProductsByIds(ids: Product<any>['id'][], condition = {}) {
    if (!ids?.length) {
      return [];
    }
    return this.entityManager.find(Product, {
      where: {
        id: In(ids),
        ...condition,
      },
    });
  }

  async getProductById(id: Product<any>['id']) {
    return this.entityManager.findOne(Product, {
      where: {
        id,
      },
    });
  }

  async getProductByUUID(uuid: Product<any>['url']) {
    return this.entityManager.findOne(Product, {
      where: {
        url: uuid,
      },
    });
  }

  async canEditProduct(product: Product<any> | null, user: CurrentUser) {
    if (product) {
      if (product.ownerType === ProductOwner.User) {
        return product.ownerId === user.id ? product : null;
      }

      if (product.ownerType === ProductOwner.Shop) {
        return (await this.shopService.canEditShop(user.id, product.ownerId)) ? product : null;
      }
    }
    return null;
  }

  async canEditProductById(productId: Product<any>['id'], user: CurrentUserType) {
    return this.canEditProduct(await this.getProductById(productId), user);
  }

  canBuyProduct(product: Product<any>, quantity: number) {
    return product?.status === this.productShowStatus && product?.quantity >= quantity;
  }

  async getOwner(target: iActionTarget) {
    return this._getOwner(target.type, target.id);
  }

  async ownerInfo(target: iActionTarget): Promise<OwnerInfo> {
    return OwnerInfo.from(await this._getOwner(target.type, target.id));
  }

  async updateOwner(owner: Shop | User, update) {
    return this.entityManager.update(owner.constructor, owner.id, update || {});
  }

  getOwnerByUUID(sellerType: ProductOwner, sellerUUID: string): Promise<Shop | User> {
    const ownerModel = !!ProductOwner[sellerType] && ProductOwnerModelByType[sellerType];
    if (!ownerModel) {
      return null;
    }
    return this.entityManager.findOne(ownerModel, {
      where: {
        uuid: sellerUUID,
      },
    });
  }
}
