import { Product } from '../Product.abstract';
import { ChildEntity, OneToOne } from 'typeorm';
import { ProductType } from '../ProductType.enum';
import { KeyChainAttributes } from './key-chain.attributes';

@ChildEntity(ProductType.KeyChain)
export class KeyChain extends Product<KeyChainAttributes> {
  static readonly attributesEntity = KeyChainAttributes;

  @OneToOne(() => KeyChain.attributesEntity, (attributes) => attributes.product)
  attributes: (typeof KeyChain)['attributesEntity'];
}
