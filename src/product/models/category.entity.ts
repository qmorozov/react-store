import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../app/models/entity-helper';
import { ProductType } from './ProductType.enum';
import { ColumnFromTranslations } from '../../app/database/database.decorators';
import TableName from '../../app/database/tables.json';
import { BrandToCategory } from './brand-to-category.entity';

@Entity({
  name: TableName.Category,
})
export class Category extends Model {
  static fillable = ['url', 'status', 'image', 'name_en'];

  static public = ['id', 'url', 'productType', 'image', 'name'];

  @PrimaryGeneratedColumn()
  id: number;

  subCategories: Category[];

  @Column()
  parentId: number | null;

  @Column({
    enum: ProductType,
  })
  productType: ProductType | null;

  @Column({
    type: 'boolean',
  })
  status: boolean;

  @Column()
  url: string;

  get link() {
    return `/catalog/${this.url}`;
  }

  @Column()
  image: string;

  @Column()
  name_en: string;

  @Column()
  order: number;

  @ColumnFromTranslations<Category>({
    en: 'name_en',
  })
  name: string;

  @OneToMany(() => BrandToCategory, (brandToCategory) => brandToCategory.category)
  public brandToCategory!: BrandToCategory[];
}
