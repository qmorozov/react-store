import { ChildEntity, OneToOne } from 'typeorm';
import { Product } from '../Product.abstract';
import { ProductType } from '../ProductType.enum';
import { GlassesAttributes } from './glasses.attributes';

@ChildEntity(ProductType.Glasses)
export class Glasses extends Product<GlassesAttributes> {
  static readonly attributesEntity = GlassesAttributes;

  @OneToOne(() => Glasses.attributesEntity, (attributes) => attributes.product)
  attributes: typeof Glasses['attributesEntity'];
}
