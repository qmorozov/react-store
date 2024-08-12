import { Model } from '../../app/models/entity-helper';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import TableName from '../../app/database/tables.json';
import { BrandToCategory } from './brand-to-category.entity';

@Entity({
  name: TableName.Brands,
})
export class Brand extends Model {
  static fillable = ['name', 'showOnMain', 'order'];

  static public = ['id', 'name', 'url', 'image', 'order'];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  url: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    nullable: false,
    default: false,
  })
  showOnMain: boolean;

  @Column({
    nullable: false,
    default: 0,
  })
  order: number;

  @OneToMany(() => BrandToCategory, (brandToCategory) => brandToCategory.brand)
  public brandToCategory!: BrandToCategory[];

  get link() {
    return `/brand/${this.url}`;
  }

  fromJson(dto) {
    dto.showOnMain = dto.showOnMain === 1 || dto.showOnMain === 'true';
    dto.name = dto.name.trim();
    return super.fromJson(dto);
  }
}
