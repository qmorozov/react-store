import { Product } from '../Product.abstract';
import { ChildEntity, OneToOne } from 'typeorm';
import { ProductType } from '../ProductType.enum';
import { PinsBroochesAttributes } from './pinsBrooches.attributes';

@ChildEntity(ProductType.PinsBrooches)
export class PinsBrooches extends Product<PinsBroochesAttributes> {
  static readonly attributesEntity = PinsBroochesAttributes;

  @OneToOne(() => PinsBrooches.attributesEntity, (attributes) => attributes.product)
  attributes: (typeof PinsBrooches)['attributesEntity'];
}
