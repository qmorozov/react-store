import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Bracelet } from './Bracelet';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';

@Entity({
  name: TableName.ProductAttributesBracelet,
})
export class BraceletAttributes extends Model {
  protected static fillable = ['material', 'coating_color', 'stones', 'size'];
  protected static public = BraceletAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Bracelet, (bracelet) => bracelet.attributes)
  @JoinColumn()
  product: Bracelet;

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
