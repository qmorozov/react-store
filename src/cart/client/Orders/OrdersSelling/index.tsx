import { FC, useState } from 'react';
import OrderItem from '../OrderItem';
import { useTranslations } from '../../../../translation/translation.context';

interface IOrdersSelling {
  sellingOrders: any[];
}

const OrdersSelling: FC<IOrdersSelling> = ({ sellingOrders }) => {
  const tr = useTranslations();
  const [visibleOrders, setVisibleOrders] = useState<number>(4);

  const showMore = () => {
    setVisibleOrders((prevVisibleOrders: number) => prevVisibleOrders + 4);
  };

  const remainingOrders = sellingOrders.length - visibleOrders;
  const showMoreText = remainingOrders > 0 ? `${tr.get('common.More')} ${remainingOrders}` : tr.get('common.NoMore');

  if (!sellingOrders.length) {
    return (
      <div className="no-info">
        <h2>{tr.get('orders.noInfoSelling.title')}</h2>
        <p>{tr.get('orders.noInfoSelling.subTitle')}</p>
      </div>
    );
  }

  return (
    <>
      {sellingOrders.slice(0, visibleOrders).map((order) => {
        return <OrderItem key={order.id} order={order} />;
      })}
      {remainingOrders > 0 && (
        <button className="show-more-btn" onClick={showMore}>
          {showMoreText}
        </button>
      )}
    </>
  );
};

export default OrdersSelling;
