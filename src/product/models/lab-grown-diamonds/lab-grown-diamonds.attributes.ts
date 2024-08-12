import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';
import { LabGrownDiamond } from './LabGrownDiamond';

@Entity({
  name: TableName.ProductAttributesLabGrownDiamonds,
})
export class LabGrownDiamondsAttributes extends Model {
  protected static fillable = [
    'shape',
    'kind',
    'cut',
    'clarity',
    'colorGrade',
    'carat',
    'fluorescence',
    'lwRatio',
    'cutScore',
    'table',
    'depth',
  ];
  protected static public = LabGrownDiamondsAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => LabGrownDiamond, (diamond) => diamond.attributes)
  @JoinColumn()
  product: LabGrownDiamond;

  @Column()
  productId: number;

  @Column()
  kind: string;

  @Column()
  cut: string;

  @Column()
  clarity: string;

  @Column()
  colorGrade: string;

  @Column()
  carat: number;

  @Column()
  shape: string;

  @Column()
  fluorescence: string;

  @Column()
  lwRatio: number;

  @Column()
  cutScore: number;

  @Column()
  table: number;

  @Column()
  depth: number;
}
