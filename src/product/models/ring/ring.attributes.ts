import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ring } from './Ring';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';

@Entity({
  name: TableName.ProductAttributesRing,
})
export class RingAttributes extends Model {
  protected static fillable = ['material', 'coating_color', 'stones', 'size'];
  protected static public = RingAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Ring, (ring) => ring.attributes)
  @JoinColumn()
  product: Ring;

  @Column()
  productId: number;

  @Column()
  material: string;

  @Column()
  coating_color: string;

  @Column()
  stones: string;

  @Column()
  size: string;
}
