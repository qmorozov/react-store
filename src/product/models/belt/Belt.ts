import { ChildEntity, OneToOne } from 'typeorm';
import { Product } from '../Product.abstract';
import { ProductType } from '../ProductType.enum';
import { BeltAttributes } from './belt.attributes';

@ChildEntity(ProductType.Belt)
export class Belt extends Product<BeltAttributes> {
  static readonly attributesEntity = BeltAttributes;

  @OneToOne(() => Belt.attributesEntity, (attributes) => attributes.product)
  attributes: (typeof Belt)['attributesEntity'];
}
