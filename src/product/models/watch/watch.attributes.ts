import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Watch } from './Watch';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';

@Entity({
  name: TableName.ProductAttributesWatch,
})
export class WatchAttributes extends Model {
  protected static fillable = [
    'version',
    'body_diameter',
    'body_material',
    'combined_materials',
    'color_of_body',
    'coating',
    'body_shape',
    'water_protection',
    'dial_color',
    'type_of_indication',
    'material',
    'mechanism_type',
    'glass',
    'bracelet_or_strap',
  ];
  protected static public = WatchAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Watch, (watch) => watch.attributes)
  @JoinColumn()
  product: Watch;

  @Column()
  productId: number;

  @Column()
  version: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  body_material: string;

  @Column()
  combined_materials: string;

  @Column()
  color_of_body: string;

  @Column()
  coating: string;

  @Column()
  body_shape: string;

  @Column()
  water_protection: string;

  @Column()
  dial_color: string;

  @Column()
  type_of_indication: string;

  @Column()
  material: string;

  @Column()
  mechanism_type: string;

  @Column()
  glass: string;

  @Column()
  bracelet_or_strap: string;
}
