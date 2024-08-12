import { Product } from '../Product.abstract';
import { ChildEntity, OneToOne } from 'typeorm';
import { ProductType } from '../ProductType.enum';
import { EarringsAttributes } from './earrings.attributes';

@ChildEntity(ProductType.Earrings)
export class Earrings extends Product<EarringsAttributes> {
  static readonly attributesEntity = EarringsAttributes;

  @OneToOne(() => Earrings.attributesEntity, (attributes) => attributes.product)
  attributes: (typeof Earrings)['attributesEntity'];
}
