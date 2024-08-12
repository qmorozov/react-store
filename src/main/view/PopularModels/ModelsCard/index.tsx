import { FC } from 'react';
import { useTranslations } from '../../../../translation/translation.context';

interface IModelCard {
  image: string;
  title: string;
  desc: string;
  type: string;
  price: string | number;
  currency: string;
}

const ModelCard: FC<IModelCard> = ({ image, desc, type, title, price, currency }) => {
  const tr = useTranslations();

  return (
    <div className="model-card">
      <a className="model-card__img">
        <img src={image} alt={title} title={title} />
      </a>
      <a className="model-card__info">
        <span className="model-card__info-title">{title}</span>
        <p>{desc}</p>
        <span className="model-card__info-type">{type}</span>
      </a>
      <div className="model-card__price">
        <span>
          {tr.get('common.From')} {price}
        </span>
        <span className="model-card__price-currency">{currency}</span>
      </div>
    </div>
  );
};

export default ModelCard;
