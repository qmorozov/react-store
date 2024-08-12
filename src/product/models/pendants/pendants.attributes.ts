import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';
import { Pendants } from './Pendants';

@Entity({
  name: TableName.ProductAttributesPendants,
})
export class PendantsAttributes extends Model {
  protected static fillable = [
    'size',
    'type',
    'coating',
    'material',
    'color',
    'gemstonesQuantity',
    'gemstones',
    'mixedStones',
    'largeStones',
    'gemstoneColor',
    'incut',
    'incutColor',
    'packing',
  ];
  protected static public = PendantsAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Pendants, (pendants) => pendants.attributes)
  @JoinColumn()
  product: Pendants;

  @Column()
  productId: number;

  @Column()
  size: string;

  @Column()
  type: string;

  @Column()
  coating: string;

  @Column()
  material: string;

  @Column()
  color: string;

  @Column()
  gemstonesQuantity: string;

  @Column()
  gemstones: string;

  @Column()
  mixedStones: boolean;

  @Column()
  largeStones: boolean;

  @Column()
  gemstoneColor: string;

  @Column()
  incut: boolean;

  @Column()
  incutColor: string;

  @Column()
  packing: string;
}
