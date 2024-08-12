import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Glasses } from './Glasses';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';

@Entity({
  name: TableName.ProductAttributesGlasses,
})
export class GlassesAttributes extends Model {
  protected static fillable = ['lenses_color', 'frame_color', 'frame_material', 'frame_shape'];
  protected static public = GlassesAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Glasses, (glasses) => glasses.attributes)
  @JoinColumn()
  product: Glasses;

  @Column()
  productId: number;

  @Column()
  lenses_color: string;

  @Column()
  frame_color: string;

  @Column()
  frame_material: string;

  @Column()
  frame_shape: string;
}
