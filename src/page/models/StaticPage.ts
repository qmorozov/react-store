import { Model } from '../../app/models/entity-helper';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import TableName from '../../app/database/tables.json';
import { ColumnFromTranslations } from '../../app/database/database.decorators';

@Entity({
  name: TableName.StaticPage,
})
export class StaticPage extends Model {
  public static fillable = [...Model.langCol('title'), ...Model.langCol('content')];

  public static public = ['id', 'url', 'status', 'locked', 'title', 'content'];

  static lockedUrls = [
    'about',
    'privacy-policy',
    'terms-and-conditions',
    'advice-for-seller',
    'delivery-and-payment',
    'guarantees',
    'return-policy',
  ];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  url: string;

  get link() {
    return `/page/${this.url}`;
  }

  @Column()
  status: boolean;

  get locked() {
    return StaticPage.lockedUrls.includes(this.url);
  }

  @Column()
  title_en: string;

  @ColumnFromTranslations<StaticPage>({
    en: 'title_en',
  })
  title: string;

  @Column()
  content_en: string;

  @ColumnFromTranslations<StaticPage>({
    en: 'content_en',
  })
  content: string;
}
