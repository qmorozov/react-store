import { ChildEntity, OneToOne } from 'typeorm';
import { Product } from '../Product.abstract';
import { ProductType } from '../ProductType.enum';
import { NaturalDiamondsAttributes } from './natural-diamonds.attributes';

@ChildEntity(ProductType.NaturalDiamond)
export class NaturalDiamond extends Product<NaturalDiamondsAttributes> {
  static readonly attributesEntity = NaturalDiamondsAttributes;

  @OneToOne(() => NaturalDiamond.attributesEntity, (attributes) => attributes.product)
  attributes: (typeof NaturalDiamond)['attributesEntity'];
}
