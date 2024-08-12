import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TieClip } from './TieClip';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';

@Entity({
  name: TableName.ProductAttributesTieClip,
})
export class TieClipAttributes extends Model {
  protected static fillable = [
    'size',
    'material',
    'type',
    'color',
    'style',
    'incut',
    'gemstones',
    'gemstoneType',
    'engraving',
    'packing',
  ];
  protected static public = TieClipAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TieClip, (tieClip) => tieClip.attributes)
  @JoinColumn()
  product: TieClip;

  @Column()
  productId: number;

  @Column()
  size: string;

  @Column()
  material: string;

  @Column()
  type: string;

  @Column()
  color: string;

  @Column()
  style: string;

  @Column()
  incut: string;

  @Column()
  gemstoneType: string;

  @Column()
  engraving: boolean;

  @Column()
  packing: string;
}
