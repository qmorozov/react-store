import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';
import { JewellerySets } from './JewellerySets';

@Entity({
  name: TableName.ProductAttributesJewellerySets,
})
export class JewellerySetsAttributes extends Model {
  protected static fillable = [
    'necklace',
    'earrings',
    'brooch',
    'bracelet',
    'diadem',
    'ring',
    'pendant',
    'size',
    'material',
    'color',
    'materialCombined',
    'gemstones',
    'mixedStones',
    'gemstonesMixedStones',
    'packing',
  ];
  protected static public = JewellerySetsAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => JewellerySets, (jewellerySets) => jewellerySets.attributes)
  @JoinColumn()
  product: JewellerySets;

  @Column()
  productId: number;

  @Column()
  necklace: boolean;

  @Column()
  earrings: boolean;

  @Column()
  brooch: boolean;

  @Column()
  bracelet: boolean;

  @Column()
  diadem: boolean;

  @Column()
  ring: boolean;

  @Column()
  pendant: boolean;

  @Column()
  size: string;

  @Column()
  material: string;

  @Column()
  color: string;

  @Column()
  materialCombined: string;

  @Column()
  gemstones: string;

  @Column()
  mixedStones: boolean;

  @Column()
  gemstonesMixedStones: string;

  @Column()
  packing: string;
}
