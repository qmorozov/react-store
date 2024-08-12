import { ChildEntity, OneToOne } from 'typeorm';
import { Product } from '../Product.abstract';
import { ProductType } from '../ProductType.enum';
import { RingAttributes } from './ring.attributes';

@ChildEntity(ProductType.Ring)
export class Ring extends Product<RingAttributes> {
  static readonly attributesEntity = RingAttributes;

  @OneToOne(() => Ring.attributesEntity, (attributes) => attributes.product)
  attributes: typeof Ring['attributesEntity'];
}
