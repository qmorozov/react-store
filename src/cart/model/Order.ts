import { Model } from '../../app/models/entity-helper';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import TableName from '../../app/database/tables.json';
import { OrderStatus } from './OrderStatus.enum';
import { User } from '../../user/models/User';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { OrderProductInfo } from './OrderProductInfo';
import { Currency } from '../../payment/model/currency.enum';
import { OrderDeliveryInfo } from './OrderDeliveryInfo';
import { OrderShippingInfo } from './OrderShippingInfo';
import { OrderContactsInfo } from './OrderContactsInfo';
import { Payment } from '../../payment/model/Payment';
import type { Shop } from '../../shop/models/Shop';

@Entity({
  name: TableName.Orders,
})
export class Order extends Model {
  protected static public = [
    'id',
    'status',
    'userId',
    'user',
    'seller',
    'sellerType',
    'sellerId',
    'products',
    'totalProducts',
    'amount',
    'currency',
    'delivery',
    'shipping',
    'contacts',
    'createdAt',
    'updatedAt',
  ];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;

  @Column({
    nullable: false,
  })
  userId!: number;

  @ManyToOne(() => User)
  user: User;

  @Column({
    nullable: false,
    enum: ProductOwner,
  })
  sellerType: ProductOwner;

  @Column({
    nullable: false,
  })
  sellerId: number;

  @Column({
    nullable: false,
    type: 'json',
  })
  products: OrderProductInfo[];

  @Column({
    nullable: false,
    default: 1,
  })
  totalProducts: number;

  @Column({
    nullable: false,
    default: 0,
  })
  amount: number;

  @Column({
    nullable: false,
    default: Currency.USD,
  })
  currency: Currency = Currency.USD;

  @Column({
    type: 'json',
    nullable: false,
  })
  delivery: OrderDeliveryInfo;

  @Column({
    type: 'json',
    nullable: false,
  })
  shipping: OrderShippingInfo;

  @Column({
    type: 'json',
    nullable: false,
  })
  contacts: OrderContactsInfo;

  @OneToOne(() => Payment)
  @JoinColumn()
  payment: Payment | null;

  @Column('int')
  paymentId!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  seller?: Shop | User;
}
