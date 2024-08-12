import { ChildEntity, OneToOne } from 'typeorm';
import { Product } from '../Product.abstract';
import { ProductType } from '../ProductType.enum';
import { WalletAttributes } from './wallet.attributes';

@ChildEntity(ProductType.Wallet)
export class Wallet extends Product<WalletAttributes> {
  static readonly attributesEntity = WalletAttributes;

  @OneToOne(() => Wallet.attributesEntity, (attributes) => attributes.product)
  attributes: typeof Wallet['attributesEntity'];
}
