import { FC } from 'react';
import { useTranslations } from '../../../../translation/translation.context';

interface IProductDescription {
  description: string;
}

const ProductDescription: FC<IProductDescription> = ({ description }) => {
  const tr = useTranslations();

  return (
    <div className="description">
      <span className="description__title">{tr.get('manageProduct.productPage.description')}</span>
      <p className="description__content">{description}</p>
    </div>
  );
};

export default ProductDescription;
