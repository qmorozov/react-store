import { ProductOwner } from './Product.owner.enum';
import { Currency } from '../../payment/model/currency.enum';
import type { User } from '../../user/models/User';
import type { Shop } from '../../shop/models/Shop';

export class OwnerInfo {
  static from(model: User | Shop): OwnerInfo {
    const owner = new OwnerInfo();
    owner.id = model.id;
    owner.type = model?.type;
    owner.url = model.url || null;
    owner.uuid = model.uuid || null;
    owner.productsSold = model.productsSold || 0;
    owner.responseTime = 24;
    owner.link = [owner.type === ProductOwner.User ? '/user' : '/shop', owner.url || owner.uuid].join('/');

    if (!(model?.type === ProductOwner.User)) {
      owner.name = model.name || null;
      owner.since = model.registrationDate || null;
    } else {
      owner.name = `${model.firstName} ${model.lastName}`;
      owner.since = model.createdAt || null;
    }

    owner.currency = model.currency || Currency.USD;
    owner.description = model.description || null;
    owner.image = model.image || null;
    owner.rating = model.rating || 0;
    owner.isOnline = !!model.$isOnline || false;
    return owner;
  }

  id: number;

  type: ProductOwner;

  isOnline = false;

  currency: Currency = Currency.USD;

  uuid: string;

  url: string;

  link: string;

  name: string;

  description: string;

  image: string;

  rating: number;

  productsSold?: number;

  since?: Date;

  responseTime?: number;
}
