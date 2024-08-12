import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';
import { NaturalDiamond } from './NaturalDiamond';

@Entity({
  name: TableName.ProductAttributesNaturalDiamonds,
})
export class NaturalDiamondsAttributes extends Model {
  protected static fillable = ['shape'];
  protected static public = NaturalDiamondsAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => NaturalDiamond, (diamond) => diamond.attributes)
  @JoinColumn()
  product: NaturalDiamond;

  @Column()
  productId: number;

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
