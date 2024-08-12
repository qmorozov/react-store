import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Bag } from './Bag';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';

@Entity({
  name: TableName.ProductAttributesBag,
})
export class BagAttributes extends Model {
  protected static fillable = ['kind', 'material', 'combined_materials', 'clasp', 'color', 'style', 'shape', 'size'];

  protected static public = BagAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Bag, (bag) => bag.attributes)
  @JoinColumn()
  product: Bag;

  @Column()
  productId: number;

  @Column()
  kind: string;

  @Column()
  material: string;

  @Column()
  combined_materials: string;

  @Column()
  clasp: string;

  @Column()
  color: string;

  @Column()
  style: string;

  @Column()
  shape: string;

  @Column()
  size: string;
}
