import { Product } from '../Product.abstract';
import { ChildEntity, OneToOne } from 'typeorm';
import { ProductType } from '../ProductType.enum';
import { BagCharmsAttributes } from './bag-charms.attributes';

@ChildEntity(ProductType.BagCharms)
export class BagCharms extends Product<BagCharmsAttributes> {
  static readonly attributesEntity = BagCharmsAttributes;

  @OneToOne(() => BagCharms.attributesEntity, (attributes) => attributes.product)
  attributes: (typeof BagCharms)['attributesEntity'];
}
