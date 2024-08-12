import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { AppRequest } from '../../app/models/request';
import { ShopUserRole } from '../../shop/models/ShopUserRole.enum';
import type { User } from '../models/User';
import type { Shop } from '../../shop/models/Shop';
import { OwnerInfo } from '../../product/models/OwnerInfo';

export type iActionTarget = {
  id: string | number;
  type: ProductOwner;
  role?: ShopUserRole;
};

export class ActionTargetKey implements iActionTarget {
  static from(target: iActionTarget): ActionTargetKey {
    return new ActionTargetKey(+target.id, +target.type);
  }

  static convert(target: User | Shop | OwnerInfo): ActionTargetKey {
    return new ActionTargetKey(Number(target.id), target.type);
  }

  constructor(public readonly id: number, public readonly type: ProductOwner) {}

  toString() {
    return `type:${this.type}|id:${this.id}`;
  }

  static validate(sellerType: ProductOwner, sellerId: string | number) {
    if (sellerType && sellerId && ProductOwner[sellerType]) {
      return new ActionTargetKey(Number(sellerId), sellerType);
    }
    return undefined;
  }
}

export const ActionTarget = createParamDecorator(
  (data: keyof CurrentUserType | undefined, ctx: ExecutionContext): iActionTarget => {
    const request: AppRequest = ctx.switchToHttp().getRequest();
    const shopId = request.query?.shop as string;

    if (shopId) {
      return request?.shop?.id
        ? {
            id: request?.shop?.id,
            type: ProductOwner.Shop,
          }
        : undefined;
    }

    return request?.user?.id
      ? {
          id: request?.user?.id,
          type: ProductOwner.User,
        }
      : undefined;
  },
);
