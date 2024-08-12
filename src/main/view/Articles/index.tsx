import { FC, ReactNode } from 'react';
import Slider from '../../../layouts/shared/Slider';
import { useTranslations } from '../../../translation/translation.context';

interface IArticles {
  articles: ReactNode[];
}

const Articles: FC<IArticles> = ({ articles }) => {
  const tr = useTranslations();

  return (
    <section className="articles-container --small">
      <div className="slider__buttons">
        <span className="articles__title">{tr.get('common.PopularArticles')}</span>
        {/*<button className="btn --right-line">{tr.get('common.byCategories')}</button>*/}
        {/*<button className="btn --right-line">{tr.get('common.ByTags')}</button>*/}
      </div>
      <Slider allButton progressBar slides={articles} navigationButtons onClickAll="/blog" containerClass="articles" />
    </section>
  );
};

export default Articles;
