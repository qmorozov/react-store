import { FC } from 'react';
import { useTranslations } from '../../../../translation/translation.context';
import { getCurrencySymbol } from '../../../../payment/model/currency.info';

interface IOrderCard {
  product: any;
}

const OrderCard: FC<IOrderCard> = ({ product }) => {
  const tr = useTranslations();

  const image =
    product?.images?.find((img) => img.id === product.cover)?.small ||
    (product?.images?.length > 0 ? product?.images[0].small : '/images/box.jpg');

  const LinkTag = product?.url ? 'a' : 'div';

  return (
    <div className="order__card">
      <LinkTag className="order__card-img" href={product?.url ? tr.link(`/product/${product?.url}`) : null}>
        <img src={image} alt={product?.title || tr.get('orders.productWasDeleted')} />
      </LinkTag>
      <div className="order__card-description">
        <div className="order__card-body">
          <div className="order__card-info">
            <span className="order__card-title">{product?.title || tr.get('orders.productWasDeleted')}</span>
            <span>{product?.description}</span>
            <span className="order__card-year">{product?.year}</span>
          </div>
        </div>
        <div className="order__card-footer">
          <div className="order__card-price">
            <span>{product?.price}</span>
            <span>{getCurrencySymbol(product?.currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
