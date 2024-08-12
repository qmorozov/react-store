import { Model } from '../../app/models/entity-helper';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnFromTranslations } from '../../app/database/database.decorators';
import tables from '../../app/database/tables.json';

@Entity({
  name: tables.BlogCategories,
})
export class BlogCategory extends Model {
  protected static fillable = ['status', 'url', ...Model.langCol('name')];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    default: null,
  })
  parentId: number | null;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  status: boolean;

  @Column({
    nullable: false,
  })
  url: string;

  @Column()
  name_en: string;

  @ColumnFromTranslations<BlogCategory>({
    en: 'name_en',
  })
  name: string;
}
