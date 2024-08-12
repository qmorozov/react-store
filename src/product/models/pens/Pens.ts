import { Product } from '../Product.abstract';
import { ChildEntity, OneToOne } from 'typeorm';
import { ProductType } from '../ProductType.enum';
import { PensAttributes } from './pens.attributes';

@ChildEntity(ProductType.Pens)
export class Pens extends Product<PensAttributes> {
  static readonly attributesEntity = PensAttributes;

  @OneToOne(() => Pens.attributesEntity, (attributes) => attributes.product)
  attributes: (typeof Pens)['attributesEntity'];
}
