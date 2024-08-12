import { ChildEntity, OneToOne } from 'typeorm';
import { Product } from '../Product.abstract';
import { ProductType } from '../ProductType.enum';
import { BagAttributes } from './bag.attributes';

@ChildEntity(ProductType.Bag)
export class Bag extends Product<BagAttributes> {
  static readonly attributesEntity = BagAttributes;

  @OneToOne(() => Bag.attributesEntity, (attributes) => attributes.product)
  attributes: (typeof Bag)['attributesEntity'];
}
