import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Wallet } from './Wallet';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';

@Entity({
  name: TableName.ProductAttributesWallet,
})
export class WalletAttributes extends Model {
  protected static fillable = [
    'material',
    'clasp',
    'color',
    'number_of_compartments_for_bills',
    'number_of_compartments_for_cards',
  ];
  protected static public = WalletAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Wallet, (wallet) => wallet.attributes)
  @JoinColumn()
  product: Wallet;

  @Column()
  productId: number;

  @Column()
  material: string;

  @Column()
  clasp: string;

  @Column()
  color: string;

  @Column()
  number_of_compartments_for_bills: string;

  @Column()
  number_of_compartments_for_cards: string;
}
