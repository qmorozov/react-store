import { Product } from '../Product.abstract';
import { ChildEntity, OneToOne } from 'typeorm';
import { ProductType } from '../ProductType.enum';
import { JewellerySetsAttributes } from './jewellery-sets.attributes';

@ChildEntity(ProductType.JewellerySets)
export class JewellerySets extends Product<JewellerySetsAttributes> {
  static readonly attributesEntity = JewellerySetsAttributes;

  @OneToOne(() => JewellerySets.attributesEntity, (attributes) => attributes.product)
  attributes: (typeof JewellerySets)['attributesEntity'];
}
