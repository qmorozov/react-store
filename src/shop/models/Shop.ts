import { Column, CreateDateColumn, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import TableName from '../../app/database/tables.json';
import { User } from '../../user/models/User';
import { ShopToUser } from './ShopToUser';
import { Model } from '../../app/models/entity-helper';
import { ShopStatus } from './ShopStatus.enum';
import { Currency } from '../../payment/model/currency.enum';
import { ProductOwner } from '../../product/models/Product.owner.enum';

@Entity({
  name: TableName.Shop,
})
export class Shop extends Model {
  public readonly type = ProductOwner.Shop as const;

  $isOnline = false;

  protected static fillable = [
    'name',
    'description',
    'formOfOrganization',
    'vatNumber',
    'country',
    'city',
    'zipCode',
    'phoneNumber',
  ];

  protected static public = [
    'uuid',
    'url',
    'status',
    'name',
    'image',
    'rating',
    'productsSold',
    'description',
    'formOfOrganization',
    'vatNumber',
    'country',
    'city',
    'zipCode',
    'phoneNumber',
  ];

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
    nullable: true,
    unique: true,
  })
  url: string;

  @Column({
    nullable: false,
    enum: ShopStatus,
    default: ShopStatus.Active,
  })
  status: ShopStatus;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
    default: null,
  })
  image: string | null;

  @Column({
    nullable: false,
    default: 0,
    type: 'decimal',
    precision: 2,
    scale: 1,
  })
  rating: number;

  @Column({
    nullable: true,
    default: null,
    enum: Currency,
  })
  currency: Currency;

  @Column({
    nullable: true,
    default: null,
  })
  description: string;

  @Column({
    nullable: true,
    default: null,
  })
  formOfOrganization: string;

  @Column({
    nullable: true,
    default: null,
  })
  vatNumber: string;

  @Column({
    nullable: true,
    default: null,
  })
  country: string;

  @Column({
    nullable: true,
    default: null,
  })
  city: string;

  @Column({
    nullable: true,
    default: null,
  })
  zipCode: string;

  @Column({
    nullable: true,
    default: null,
  })
  phoneNumber: string;

  @Column({
    nullable: false,
    default: 0,
  })
  productsSold: number;

  @CreateDateColumn({
    default: new Date(),
  })
  registrationDate: Date;

  @OneToMany(() => ShopToUser, (shopToUser) => shopToUser.shop)
  public users!: User[];
}
