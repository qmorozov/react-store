import { Model } from '../../app/models/entity-helper';
import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import tables from '../../app/database/tables.json';

@Entity({
  name: tables.BlogPosts,
})
export class BlogPost extends Model {
  protected static fillable = ['url', 'title', 'announce', 'content', 'publishedAt'];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  @Generated('uuid')
  url: string;

  @Column({
    nullable: false,
  })
  category: number;

  @Column({
    nullable: false,
    default: false,
  })
  active: boolean;

  @Column({
    nullable: false,
    default: 'en',
  })
  lang: string;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: true,
    default: null,
  })
  image: string;

  @Column({
    nullable: false,
  })
  announce: string;

  @Column({
    nullable: false,
  })
  content: string;

  @Column({
    nullable: true,
    type: 'datetime',
  })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({
    select: false,
  })
  updatedAt: Date;
}
