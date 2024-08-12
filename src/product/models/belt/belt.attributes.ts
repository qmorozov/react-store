import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Belt } from './Belt';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';

@Entity({
  name: TableName.ProductAttributesBelt,
})
export class BeltAttributes extends Model {
  protected static fillable = ['belt_length', 'material', 'clasp', 'color', 'type', 'combined_materials'];
  protected static public = BeltAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Belt, (belt) => belt.attributes)
  @JoinColumn()
  product: Belt;

  @Column()
  productId: number;

  @Column()
  belt_length: string;

  @Column()
  material: string;

  @Column()
  combined_materials: string;

  @Column()
  clasp: string;

  @Column()
  color: string;

  @Column()
  type: string;
}
