import { Product } from '../Product.abstract';
import { ChildEntity, OneToOne } from 'typeorm';
import { ProductType } from '../ProductType.enum';
import { TieClipAttributes } from './tie-clip.attributes';

@ChildEntity(ProductType.TieClip)
export class TieClip extends Product<TieClipAttributes> {
  static readonly attributesEntity = TieClipAttributes;

  @OneToOne(() => TieClip.attributesEntity, (attributes) => attributes.product)
  attributes: (typeof TieClip)['attributesEntity'];
}
