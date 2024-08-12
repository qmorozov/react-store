import { Injectable } from '@nestjs/common';
import { Product } from '../../product/models/Product.abstract';
import { CurrentUser } from '../../auth/models/CurrentUser';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { Repository } from 'typeorm';
import { FavoriteProduct } from '../../product/models/FavoriteProduct';
import { ProductSharedService } from '../../product/service/product.shared.service';

@Injectable()
export class SavedService {
  constructor(
    @InjectRepository(FavoriteProduct, Database.Main) private favoriteProductRepository: Repository<FavoriteProduct>,
    private readonly productSharedService: ProductSharedService,
  ) {}

  async addToFavorite(product: Product<any>, user: CurrentUser) {
    return this.favoriteProductRepository
      .findOneBy({
        userId: user.id,
        productId: product.id,
      })
      .catch(() => null)
      .then((exist) => {
        if (exist) {
          return exist;
        }
        return this.favoriteProductRepository.save(FavoriteProduct.create(user.id, product.id));
      });
  }

  async removeFromFavorite(productId: Product<any>['id'], user: CurrentUser) {
    return this.favoriteProductRepository
      .delete({
        userId: user.id,
        productId: productId,
      })
      .catch(() => false);
  }

  async getFavoritesCount(user: CurrentUser) {
    if (!user?.id) {
      return 0;
    }

    return this.favoriteProductRepository
      .count({
        where: {
          userId: user.id,
        },
      })
      .catch(() => 0);
  }

  getSaved(user: CurrentUser) {
    if (!user?.id) {
      return [];
    }
    return this.favoriteProductRepository
      .find({
        where: {
          userId: user.id,
        },
      })
      .then(async (list) => {
        if (!list?.length) {
          return [];
        }
        const products = await this.productSharedService.getActiveProductsByIds(list.map((p) => p.productId));

        if (!products?.length) {
          return [];
        }

        await Promise.all([
          this.productSharedService.attachOwner(products),
          this.productSharedService.attachCart(products, user),
        ]);

        return (products || []).map((p) => {
          p.$isFavorite = true;
          const owner = p.$owner;
          const product = p?.toJson();
          product.$owner = owner;
          return product;
        });
      })
      .catch(() => []);
  }
}
