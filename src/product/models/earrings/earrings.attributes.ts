import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';
import { Earrings } from './Earrings';

@Entity({
  name: TableName.ProductAttributesEarrings,
})
export class EarringsAttributes extends Model {
  protected static fillable = [
    'size',
    'type',
    'material',
    'color',
    'gem',
    'vintage',
    'proofOfOrigin',
    'originalCase',
    'cardOrCertificate',
  ];
  protected static public = EarringsAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Earrings, (earrings) => earrings.attributes)
  @JoinColumn()
  product: Earrings;

  @Column()
  productId: number;

  @Column()
  size: number;

  @Column()
  type: string;

  @Column()
  material: string;

  @Column()
  color: string;

  @Column()
  gem: string;

  @Column()
  vintage: boolean;

  @Column()
  proofOfOrigin: boolean;

  @Column()
  originalCase: boolean;

  @Column()
  cardOrCertificate: boolean;
}
