import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../app/models/entity-helper';
import tables from '../../app/database/tables.json';

@Entity({
  name: tables.LandingBannerSlide,
})
export class BannerSlide extends Model {
  static fillable = ['name', 'link', 'active'];

  static public = ['id', 'name', 'link', 'image', 'active'];

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column({
    default: 0,
  })
  order: number;

  @Column({
    default: true,
  })
  active: boolean;

  fromJson(dto) {
    dto.active = !dto.active || (dto.active as unknown as string) === 'true';
    return super.fromJson(dto);
  }
}
