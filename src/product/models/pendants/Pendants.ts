import { Product } from '../Product.abstract';
import { ChildEntity, OneToOne } from 'typeorm';
import { ProductType } from '../ProductType.enum';
import { PendantsAttributes } from './pendants.attributes';

@ChildEntity(ProductType.Pendants)
export class Pendants extends Product<PendantsAttributes> {
  static readonly attributesEntity = PendantsAttributes;

  @OneToOne(() => Pendants.attributesEntity, (attributes) => attributes.product)
  attributes: (typeof Pendants)['attributesEntity'];
}
