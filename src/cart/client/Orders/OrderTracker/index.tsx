import { FC } from 'react';
import { OrderStatus } from '../../../model/OrderStatus.enum';
import { useTranslations } from '../../../../translation/translation.context';

interface IOrderTrackerStep {
  id: OrderStatus;
  title: string;
  status: string;
}

interface IOrderTracker {
  statusId: OrderStatus;
}

const OrderTracker: FC<IOrderTracker> = ({ statusId }) => {
  const tr = useTranslations();

  const disableProgressStep = (id: OrderStatus): string => {
    return id === statusId ? '' : '--disabled';
  };

  const orderTrackerSteps: IOrderTrackerStep[] = [
    {
      id: OrderStatus.Pending,
      title: tr.get(`orderIsPlaced.${OrderStatus[OrderStatus.Pending].toString()}`),
      status: tr.get('orderIsPlaced.JustNow'),
    },
    {
      id: OrderStatus.Processing,
      title: tr.get(`orderIsPlaced.${OrderStatus[OrderStatus.Processing].toString()}`),
      status: tr.get('orderIsPlaced.Confirmation'),
    },
    {
      id: OrderStatus.Shipped,
      title: tr.get(`orderIsPlaced.${OrderStatus[OrderStatus.Shipped].toString()}`),
      status: 'May 26-29',
    },
    {
      id: OrderStatus.Delivered,
      title: tr.get(`orderIsPlaced.${OrderStatus[OrderStatus.Delivered].toString()}`),
      status: 'May 26-29',
    },
  ];

  return (
    <div className="order-tracker__progress">
      <div className="order-tracker__line">
        <span className={`--${OrderStatus[statusId]}`}></span>
      </div>
      <div className="order-tracker__items">
        {orderTrackerSteps.map(({ id, title, status }) => (
          <ul key={id} className={disableProgressStep(id)}>
            <li className="order-tracker__item-title">{title}</li>
            <li className="order-tracker__item-status">{status}</li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default OrderTracker;
