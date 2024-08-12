import { Column, Entity, Generated, Index, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';
import { Model } from '../../app/models/entity-helper';
import { ProductType } from './ProductType.enum';
import TableName from '../../app/database/tables.json';
import { ProductStatus } from './Product.status.enum';
import { ProductOwner } from './Product.owner.enum';
import { ProductSex } from './Product.sex.enum';
import { iActionTarget } from '../../user/decorator/action.target.decorator';
import { Currency } from '../../payment/model/currency.enum';
import { ProductImage } from './ProductImage';
import type { Brand } from './brand.entity';
import { OwnerInfo } from './OwnerInfo';
import environment from '../../app/configuration/configuration.env';

@Entity({
  name: TableName.Products,
})
@TableInheritance({ column: { type: 'enum', enum: ProductType, name: 'type' } })
export abstract class Product<Attributes extends Model> extends Model {
  protected static fillable = [
    'condition',
    'title',
    'description',
    'year',
    'price',
    'currency',
    'canSuggestPrice',
    'quantity',
    'brandId',
    'model',
    'sex',
    'serialNumber',
    'referenceNumber',
    'customFeatures',
  ];
  protected static public = [
    'id',
    'baseProductId',
    'status',
    'approved',
    'type',
    'model',
    'condition',
    'canSuggestPrice',
    'url',
    'rating',
    'cover',
    'images',
    'quantity',
    'ownerType',
    'ownerId',
    '$owner',
    '$brand',
    '$isFavorite',
    '$onCart',
    ...Product.fillable,
  ];

  public static baseProductCopy = [
    'type',
    'title',
    'description',
    'status',
    'canSuggestPrice',
    'ownerType',
    'ownerId',
    'year',
    'brandId',
    'model',
    'condition',
    'sex',
    'price',
    'currency',
    'serialNumber',
    'referenceNumber',
    'customFeatures',
  ];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    default: null,
  })
  baseProductId: number;

  @Column()
  type: ProductType;

  static readonly attributesEntity;

  get makeAttributes() {
    return (this.constructor as typeof Product<any>).attributesEntity;
  }

  attributes: InstanceType<(typeof Product)['attributesEntity']>;

  @Index({ fulltext: true })
  @Column()
  title: string;

  @Index({ fulltext: true })
  @Column()
  description: string;

  @Column({
    enum: ProductStatus,
    nullable: false,
    default: ProductStatus.Hidden,
  })
  status: ProductStatus;

  @Column({
    nullable: false,
    default: environment.product.defaultApproved,
  })
  approved: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  canSuggestPrice: boolean;

  @Column({
    nullable: false,
    type: 'char',
    length: 36,
    unique: true,
  })
  @Generated('uuid')
  url: string;

  get link() {
    return `/product/${this.url}`;
  }

  @Column({
    nullable: false,
    default: 0,
  })
  rating: number;

  @Column({
    enum: ProductOwner,
    nullable: false,
    default: ProductOwner.User,
  })
  ownerType: ProductOwner;

  @Column({
    nullable: false,
  })
  ownerId: number;

  @Column()
  year: number;

  @Column({
    nullable: true,
    default: null,
  })
  brandId: number;

  @Column({
    nullable: true,
    default: null,
  })
  model: string;

  @Column({
    nullable: true,
    default: null,
  })
  condition: number;

  @Column({
    enum: ProductSex,
    nullable: false,
    default: ProductSex.Unisex,
  })
  sex: ProductSex;

  @Column({
    nullable: false,
    default: 0,
  })
  quantity: number;

  @Column({
    nullable: false,
    default: 0,
  })
  price: number;

  @Column({
    nullable: false,
    default: Currency.USD,
  })
  currency: Currency = Currency.USD;

  @Column()
  serialNumber: string;

  @Column()
  referenceNumber: string;

  @Column()
  customFeatures: string;

  @Column()
  cover: string;

  @Column({
    type: 'json',
    nullable: true,
    default: null,
  })
  images: ProductImage[];

  $owner?: OwnerInfo;

  $brand?: Brand;

  $isFavorite = false;

  $onCart = false;

  setOwner(owner: iActionTarget): this {
    this.ownerId = owner.id as number;
    this.ownerType = owner.type;
    return this;
  }

  getOwner(): iActionTarget {
    return {
      id: this.ownerId,
      type: this.ownerType,
    };
  }

  public getBaseProductSharedData() {
    return Product.baseProductCopy.reduce((a, k) => {
      a[k] = this[k];
      return a;
    }, {}) as Product<any>;
  }

  makeSubProduct(): Product<any> {
    const sub: Product<any> = (this.constructor as any).fromJson(this.getBaseProductSharedData());

    sub.baseProductId = this.id;
    sub.type = this.type;
    return sub;
  }
}
