import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { differenceInHours } from 'date-fns';

import TableName from '../../app/database/tables.json';
import { Model } from '../../app/models/entity-helper';
import { Currency } from '../../payment/model/currency.enum';
import { Product } from '../../product/models/Product.abstract';
import { CurrentUser } from '../../auth/models/CurrentUser';
import { User } from '../../user/models/User';
import { SuggestPriceStatus } from './SuggestPriceStatus.enum';
import environment from '../../app/configuration/configuration.env';

@Entity({
  name: TableName.ProductCart,
})
export class ProductCart extends Model {
  protected static public = [
    'id',
    'user',
    'product',
    'suggestedPrice',
    'suggestedPriceCurrency',
    'createdAt',
    'status',
  ];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  userId!: number;

  @Column({
    nullable: false,
  })
  productId!: number;

  @Column({
    nullable: false,
    default: 1,
  })
  quantity!: number;

  @Column({
    nullable: true,
    default: null,
  })
  suggestedPrice?: number;

  @Column({
    nullable: true,
    default: null,
    enum: Currency,
  })
  suggestedPriceCurrency?: Currency;

  @CreateDateColumn({
    nullable: false,
  })
  createdAt: Date;

  @Column({
    nullable: false,
    default: SuggestPriceStatus.Pending,
  })
  protected suggestedStatus: SuggestPriceStatus;

  product?: Product<any>;

  user?: User;

  static add(product: Product<any>, user: CurrentUser): ProductCart {
    const cart = new ProductCart();
    cart.userId = user.id;
    cart.productId = product.id;
    return cart;
  }

  get hoursSinceCreated(): number {
    return differenceInHours(new Date(), this.createdAt);
  }

  get expiredInHours(): number {
    return (environment.suggestPrice.lifeTimeInHours || 24) - Math.abs(this.hoursSinceCreated);
  }

  get status(): SuggestPriceStatus {
    if (this.suggestedStatus === SuggestPriceStatus.Pending) {
      if (this.expiredInHours < 0) {
        return SuggestPriceStatus.OutOfDate;
      }
    }
    return this.suggestedStatus;
  }

  set status(status: SuggestPriceStatus) {
    this.suggestedStatus = status;
  }

  toJson() {
    const data = super.toJson();
    data.status = this.status;
    if (data.status === SuggestPriceStatus.Pending) {
      data.expiredInHours = this.expiredInHours;
    }
    return data;
  }
}
