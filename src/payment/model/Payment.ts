import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import TableName from '../../app/database/tables.json';
import { Model } from '../../app/models/entity-helper';
import { OrderType } from './order-type.enum';
import { Currency } from './currency.enum';
import { OrderStatus } from './order-status.enum';
import environment from '../../app/configuration/configuration.env';
import { Price } from './price';

@Entity({
  name: TableName.Payments,
})
export class Payment extends Model {
  static public = ['id', 'uuid', 'amount', 'currency', 'paymentStatus', 'createdAt'];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'char',
    length: 36,
    unique: true,
  })
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: false,
    enum: OrderType,
  })
  type: OrderType;

  @Column({
    type: 'float',
    nullable: true,
    default: null,
  })
  amount: number;

  @Column({
    nullable: false,
    default: Currency.USD,
  })
  currency: Currency = Currency.USD;

  @Column({
    nullable: false,
    default: OrderStatus.New,
  })
  paymentStatus: string;

  previousPaymentStatus?: string;

  @Column({
    nullable: true,
    default: null,
  })
  paymentIntent: string;

  @Column({
    nullable: true,
    default: null,
  })
  paymentClientSecret: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(type: OrderType, amount: number, currency: Currency) {
    super();
    this.type = type;
    this.amount = amount;
    this.currency = currency;
  }

  async getUICredentials() {
    return {
      publishableKey: environment.stripe.publishableKey,
      clientSecret: this.paymentClientSecret,
    };
  }

  get statusChanged(): boolean {
    return this.previousPaymentStatus && this.previousPaymentStatus !== this.paymentStatus;
  }

  get isSuccessful(): boolean {
    return this.paymentStatus === OrderStatus.Succeeded;
  }

  getAmount() {
    return Number(this.amount);
  }

  getPrice(): Price {
    return {
      amount: this.getAmount(),
      currency: this.currency,
    };
  }

  isFinal() {
    return this.paymentStatus === OrderStatus.Succeeded || this.paymentStatus === OrderStatus.Failed;
  }

  updateStatus(status: string): this {
    if (status !== this.paymentStatus) {
      this.previousPaymentStatus = this.paymentStatus;
      this.paymentStatus = status;
    }
    return this;
  }
}
