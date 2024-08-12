import { Product } from '../Product.abstract';
import { ChildEntity, OneToOne } from 'typeorm';
import { ProductType } from '../ProductType.enum';
import { CufflinksAttributes } from './cufflinks.attributes';

@ChildEntity(ProductType.Cufflinks)
export class Cufflinks extends Product<CufflinksAttributes> {
  static readonly attributesEntity = CufflinksAttributes;

  @OneToOne(() => Cufflinks.attributesEntity, (attributes) => attributes.product)
  attributes: (typeof Cufflinks)['attributesEntity'];
}
