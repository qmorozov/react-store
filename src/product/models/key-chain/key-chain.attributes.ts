import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { KeyChain } from './KeyChain';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';

@Entity({
  name: TableName.ProductAttributesKeyChain,
})
export class KeyChainAttributes extends Model {
  protected static fillable = ['size', 'shape', 'material', 'color', 'gemstones', 'engraving', 'packing'];
  protected static public = KeyChainAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => KeyChain, (keyChain) => keyChain.attributes)
  @JoinColumn()
  product: KeyChain;

  @Column()
  productId: number;

  @Column()
  size: number;

  @Column()
  shape: string;

  @Column()
  material: string;

  @Column()
  color: string;

  @Column()
  gemstones: string;

  @Column()
  engraving: boolean;

  @Column()
  packing: string;
}
