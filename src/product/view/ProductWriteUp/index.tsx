import { OwnerInfo } from '../../models/OwnerInfo';
import ProductDescription from './ProductDescription';
import { FC } from 'react';

interface IProductWriteUp {
  description: string;
  seller: OwnerInfo;
}

const ProductWriteUp: FC<IProductWriteUp> = ({ description, seller }) => {
  const { uuid, type } = seller;

  return (
    <div className="seller-written-container">
      <div className={`seller-written-container --small ${!description ? '--no-description' : ''}`}>
        <div id="seller-review" data-seller-uuid={uuid} data-seller-type={type}></div>
        {description && <ProductDescription description={description} />}
      </div>
    </div>
  );
};

export default ProductWriteUp;
