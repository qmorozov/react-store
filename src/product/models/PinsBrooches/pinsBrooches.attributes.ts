import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';
import { PinsBrooches } from './PinsBrooches';

@Entity({
  name: TableName.ProductAttributesPinsBrooches,
})
export class PinsBroochesAttributes extends Model {
  protected static fillable = ['size', 'type', 'gemstoneType', 'packing'];
  protected static public = PinsBroochesAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => PinsBrooches, (pinsBrooches) => pinsBrooches.attributes)
  @JoinColumn()
  product: PinsBrooches;

  @Column()
  productId: number;

  @Column()
  size: number;

  @Column()
  type: string;

  @Column()
  material: string;

  @Column()
  gemstoneType: string;

  @Column()
  packing: string;
}
