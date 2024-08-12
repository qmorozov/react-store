import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Necklace } from './Necklace';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';

@Entity({
  name: TableName.ProductAttributesNecklace,
})
export class NecklaceAttributes extends Model {
  protected static fillable = ['material', 'coating_color', 'stones', 'size'];
  protected static public = NecklaceAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Necklace, (necklace) => necklace.attributes)
  @JoinColumn()
  product: Necklace;

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
