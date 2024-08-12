import { ChildEntity, OneToOne } from 'typeorm';
import { Product } from '../Product.abstract';
import { ProductType } from '../ProductType.enum';
import { WatchAttributes } from './watch.attributes';

@ChildEntity(ProductType.Watch)
export class Watch extends Product<WatchAttributes> {
  static readonly attributesEntity = WatchAttributes;

  @OneToOne(() => Watch.attributesEntity, (attributes) => attributes.product)
  attributes: typeof Watch['attributesEntity'];
}
