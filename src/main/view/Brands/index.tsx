import { FC } from 'react';
import Slider from '../../../layouts/shared/Slider';
import { useTranslations } from '../../../translation/translation.context';
import type { Brand } from '../../../product/models/brand.entity';

const Brands: FC<{ brands: Brand[] }> = ({ brands }) => {
  const tr = useTranslations();
  return (
    <section className="brands-container --small">
      <h2>{tr.get('common.brands')}</h2>
      <Slider
        navigationButtons
        slides={brands.map(({ id, image, link, name }) => (
          <a key={id} className="brands__item" href={link} title={name}>
            <img src={image} alt={`brands ${name}`} />
          </a>
        ))}
        containerClass="brands"
      />
    </section>
  );
};

export default Brands;
