import { FC, ReactNode } from 'react';
import Slider from '../../../layouts/shared/Slider';
import { useTranslations } from '../../../translation/translation.context';

interface IPopularModels {
  popularModels: ReactNode[];
}

const PopularModels: FC<IPopularModels> = ({ popularModels }) => {
  const tr = useTranslations();

  return (
    <section className="popular-models-container">
      <div className="slider__buttons">
        <button className="btn --dark">{tr.get('common.popularModels')}</button>
        <button className="btn --right-line">{tr.get('common.byCategories')}</button>
      </div>
      <Slider allButton progressBar navigationButtons slides={popularModels} />
    </section>
  );
};

export default PopularModels;
