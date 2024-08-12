import { ProductOwner } from './Product.owner.enum';
import { User } from '../../user/models/User';
import { Shop } from '../../shop/models/Shop';

export const ProductOwnerModelByType: Record<ProductOwner, typeof User | typeof Shop> = {
  [ProductOwner.User]: User,
  [ProductOwner.Shop]: Shop,
};
