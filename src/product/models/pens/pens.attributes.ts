import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pens } from './Pens';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';

@Entity({
  name: TableName.ProductAttributesPens,
})
export class PensAttributes extends Model {
  protected static fillable = [
    'bodyColor',
    'size',
    'bodyMaterial',
    'inkColor',
    'inkReplaceable',
    'engraving',
    'vintage',
    'rare',
    'awardCommemorative',
    'comesWithPacking',
    'tags',
    'type',
    'combined_materials',
  ];
  protected static public = PensAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Pens, (pens) => pens.attributes)
  @JoinColumn()
  product: Pens;

  @Column()
  productId: number;

  @Column()
  size: number;

  @Column()
  bodyColor: string;

  @Column()
  bodyMaterial: string;

  @Column()
  combined_materials: string;

  @Column()
  inkColor: string;

  @Column()
  inkReplaceable: boolean;

  @Column()
  engraving: boolean;

  @Column()
  vintage: boolean;

  @Column()
  rare: boolean;

  @Column()
  awardCommemorative: boolean;

  @Column()
  comesWithPacking: boolean;

  @Column()
  originalCase: boolean;

  @Column()
  tags: boolean;

  @Column()
  type: string;
}
