import { FC, ReactNode } from 'react';
import Slider from '../Slider';
import { useTranslations } from '../../../translation/translation.context';

interface IPopularProducts {
  productCards: ReactNode[];
}

const PopularProducts: FC<IPopularProducts> = ({ productCards }) => {
  const tr = useTranslations();

  return (
    <section className="popular-container --small">
      <div className="slider__buttons">
        <span className="popular__title">{tr.get('common.popularProducts')}</span>
        {/*<button className="btn --right-line">{tr.get('common.byCategories')}</button>*/}
      </div>
      <Slider progressBar navigationButtons slides={productCards} />
    </section>
  );
};

export default PopularProducts;
