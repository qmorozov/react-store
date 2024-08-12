import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cufflinks } from './Cufflinks';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';

@Entity({
  name: TableName.ProductAttributesCufflinks,
})
export class CufflinksAttributes extends Model {
  protected static fillable = [
    'size',
    'material',
    'color',
    'gemstone',
    'gemstoneType',
    'cufflinkQuantity',
    'engraving',
    'shape',
    'textured',
    'type',
    'packing',
    'combined_materials',
  ];
  protected static public = CufflinksAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Cufflinks, (cufflinks) => cufflinks.attributes)
  @JoinColumn()
  product: Cufflinks;

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
  gemstoneType: string;

  @Column()
  cufflinkQuantity: string;

  @Column()
  engraving: boolean;

  @Column()
  shape: string;

  @Column()
  textured: boolean;

  @Column()
  type: string;

  @Column()
  packing: string;
}
