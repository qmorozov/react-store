import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import TableName from '../../app/database/tables.json';
import { ColumnFromTranslations } from '../../app/database/database.decorators';
import { Model } from '../../app/models/entity-helper';

export abstract class Faq extends Model {
  static fillable = [...Model.langCol('title'), ...Model.langCol('answer')];

  static public = ['id', 'title', 'answer'];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: null,
  })
  parentId: number;

  @Column()
  title_en: string;

  @ColumnFromTranslations<Faq>({
    en: 'title_en',
  })
  title: string;
}

@Entity({
  name: TableName.Faq,
})
export class FaqCategory extends Faq {
  @OneToMany(() => FaqQuestion, (faq) => faq.parent)
  questions: FaqQuestion[];
}

@Entity({
  name: TableName.Faq,
})
export class FaqQuestion extends Faq {
  @ManyToOne(() => FaqCategory, (faq) => faq.questions)
  parent: FaqCategory;

  @Column()
  answer_en: string;

  @ColumnFromTranslations<FaqQuestion>({
    en: 'answer_en',
  })
  answer: string;
}

export const faqEntities = [Faq, FaqCategory, FaqQuestion];
