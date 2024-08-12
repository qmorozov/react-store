import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import TableName from '../../app/database/tables.json';
import { ProductType } from './ProductType.enum';
import { ColumnFromTranslations } from '../../app/database/database.decorators';
import { Model } from '../../app/models/entity-helper';

@Entity({
  name: TableName.ProductAttributes,
})
export class ProductAttributes extends Model {
  static fillable = ['productType', 'attribute', ...Model.langCol('name')];

  static public = ['id', 'value', 'name'];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    enum: ProductType,
    nullable: false,
  })
  productType: ProductType;

  @Column({
    nullable: false,
  })
  attribute: string;

  @Column({
    nullable: false,
  })
  value: string;

  @Column()
  name_en: string;

  @ColumnFromTranslations<ProductAttributes>({
    en: 'name_en',
  })
  name: string;

  $title?: string;
}
