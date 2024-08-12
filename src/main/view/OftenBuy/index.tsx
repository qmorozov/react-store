import { FC } from 'react';
import { useTranslations } from '../../../translation/translation.context';
import Slider from '../../../layouts/shared/Slider';

interface IOftenBuy {
  categories: any;
}

const OftenBuy: FC<IOftenBuy> = ({ categories }) => {
  const tr = useTranslations();

  const oftenBuyItems = () =>
    categories.map((category) => (
      <a key={category.id} className="often-buy__card" href={`catalog/${category.url}`}>
        <img src={category.image ? category.image : '/images/box.jpg'} alt={category.name} />
        <span>{category.name ? category.name : category.name_en}</span>
      </a>
    ));

  return (
    <section className="often-buy-container">
      {/*<div className="slider__buttons">*/}
      {/*  <button className="btn --dark">{tr.get('common.peopleAreBuying')}</button>*/}
      {/*  <button className="btn --right-line">{tr.get('common.mostViewed')}</button>*/}
      {/*</div>*/}
      <Slider progressBar navigationButtons slides={oftenBuyItems()} containerClass="often-buy" />
    </section>
  );
};

export default OftenBuy;
