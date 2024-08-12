import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { Repository } from 'typeorm';
import { Shop } from '../models/Shop';
import { ShopToUser } from '../models/ShopToUser';
import { ShopStatus } from '../models/ShopStatus.enum';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop, Database.Main) private shopsRepository: Repository<Shop>,
    @InjectRepository(ShopToUser, Database.Main) private shopToUserRepository: Repository<ShopToUser>,
  ) {}

  async getUserRoleForShopById(userId: number, shopId: number): Promise<ShopToUser | null> {
    return this.shopToUserRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        shop: {
          id: shopId,
        },
      },
    });
  }

  async getUserRoleForShopByUuid(userId: number, shopUUID: string): ReturnType<ShopService['getUserRoleForShopById']> {
    const shop = await this.shopsRepository.findOne({
      where: {
        uuid: shopUUID,
      },
      select: ['id'],
    });
    return shop ? this.getUserRoleForShopById(userId, shop.id) : null;
  }

  async createShop(shop: Shop, userId: number) {
    shop.status = await this.getDefaultStatus();
    const savedShop = await this.shopsRepository.save(shop);
    const shopToUser = new ShopToUser();
    shopToUser.shopId = savedShop.id;
    shopToUser.userId = userId;
    return this.shopToUserRepository.save(shopToUser).then(() => savedShop);
  }

  async userShops(id: number, limit?: number) {
    return this.shopToUserRepository
      .find({
        where: {
          user: {
            id,
          },
        },
        take: limit,
        relations: ['shop'],
      })
      .then((relation) => (relation || []).map((r) => r.shop).filter(Boolean));
  }

  async userShop(id: number) {
    return this.userShops(id, 1).then((shops) => shops[0]);
  }

  private async getDefaultStatus() {
    return ShopStatus.Active;
  }

  async getShopByUUID(shopUuid: string) {
    if (!shopUuid) {
      return null;
    }
    return this.shopsRepository.findOne({
      where: {
        uuid: shopUuid,
      },
    });
  }

  async canEditShop(userId: number, shopId: number): Promise<boolean> {
    return this.getUserRoleForShopById(userId, shopId)
      .then((role) => {
        return !!role;
      })
      .catch(() => false);
  }

  async save(shop: Shop) {
    return this.shopsRepository.save(shop);
  }

  delete(shop: Shop) {
    return this.shopsRepository.delete(shop.id);
  }
}
