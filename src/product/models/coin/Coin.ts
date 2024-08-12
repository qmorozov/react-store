import { Product } from '../Product.abstract';
import { ChildEntity, OneToOne } from 'typeorm';
import { ProductType } from '../ProductType.enum';
import { CoinAttributes } from './coin.attributes';

@ChildEntity(ProductType.Coin)
export class Coin extends Product<CoinAttributes> {
  static readonly attributesEntity = CoinAttributes;

  @OneToOne(() => Coin.attributesEntity, (attributes) => attributes.product)
  attributes: typeof Coin['attributesEntity'];
}
