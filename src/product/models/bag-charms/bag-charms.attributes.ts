import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BagCharms } from './BagCharms';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';

@Entity({
  name: TableName.ProductAttributesBagCharms,
})
export class BagCharmsAttributes extends Model {
  protected static fillable = ['size', 'material', 'combined_materials', 'color', 'gemstones', 'art', 'packing'];
  protected static public = BagCharmsAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => BagCharms, (bagCharms) => bagCharms.attributes)
  @JoinColumn()
  product: BagCharms;

  @Column()
  productId: number;

  @Column()
  size: number;

  @Column()
  material: string;

  @Column()
  combined_materials: string;

  @Column()
  color: string;

  @Column()
  gemstones: string;

  @Column()
  art: string;

  @Column()
  packing: string;
}
