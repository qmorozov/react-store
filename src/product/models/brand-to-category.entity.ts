import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import TableName from '../../app/database/tables.json';
import { Brand } from './brand.entity';
import { Category } from './category.entity';

@Entity({
  name: TableName.BrandToCategory,
})
export class BrandToCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  brandId!: number;

  @Column({
    nullable: false,
  })
  categoryId!: number;

  @Column({
    nullable: false,
  })
  isPopular!: boolean;

  @ManyToOne(() => Brand, (brand) => brand.brandToCategory)
  public brand!: Brand;

  @ManyToOne(() => Category, (category) => category.brandToCategory)
  public category!: Category;
}
