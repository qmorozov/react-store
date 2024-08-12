import { ChildEntity, OneToOne } from 'typeorm';
import { Product } from '../Product.abstract';
import { ProductType } from '../ProductType.enum';
import { BraceletAttributes } from './bracelet.attributes';

@ChildEntity(ProductType.Bracelet)
export class Bracelet extends Product<BraceletAttributes> {
  static readonly attributesEntity = BraceletAttributes;

  @OneToOne(() => Bracelet.attributesEntity, (attributes) => attributes.product)
  attributes: typeof Bracelet['attributesEntity'];
}
