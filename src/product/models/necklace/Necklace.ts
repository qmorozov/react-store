import { ChildEntity, OneToOne } from 'typeorm';
import { Product } from '../Product.abstract';
import { ProductType } from '../ProductType.enum';
import { NecklaceAttributes } from './necklace.attributes';

@ChildEntity(ProductType.Necklace)
export class Necklace extends Product<NecklaceAttributes> {
  static readonly attributesEntity = NecklaceAttributes;

  @OneToOne(() => Necklace.attributesEntity, (attributes) => attributes.product)
  attributes: typeof Necklace['attributesEntity'];
}
