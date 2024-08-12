import Accordion from '../../../../layouts/shared/Accordion';
import OrderCard from '../OrderCard';
import { FC } from 'react';
import { getCurrencySymbol } from '../../../../payment/model/currency.info';
import { OrderStatus } from '../../../model/OrderStatus.enum';
import OrderTracker from '../OrderTracker';
import { useTranslations } from '../../../../translation/translation.context';

interface IOrderItem {
  order: any;
}

const OrderItem: FC<IOrderItem> = ({ order }) => {
  const tr = useTranslations();

  const product = order.products[0].$info;

  return (
    <div className="order">
      <Accordion
        title={
          <div className="order-header">
            <div className="order-header__img">
              <img src={`${product?.images ? `${product.images[0]?.small}` : '/images/box.jpg'}`} />
            </div>
            <div className="order-header__info">
              <div className="order-header__desc">
                {product ? (
                  <>
                    <span className="order-header__status">
                      {order.status + 1}/4. {tr.get(`orderIsPlaced.${OrderStatus[order.status].toString()}`)}
                    </span>
                    <span>№ {order.id}</span>
                    <span className="order-header__count">
                      {order.products.length} {tr.get('orders.goods')}
                    </span>
                  </>
                ) : (
                  <span>{tr.get('orders.productWasDeleted')}</span>
                )}
              </div>
              <div className="order-header__price">
                <span>{order.amount}</span>
                <span>{getCurrencySymbol(order.currency)}</span>
              </div>
            </div>
            <i className="icon icon-arrow"></i>
          </div>
        }
      >
        <div className={`order-body ${!product ? '--deleted' : ''}`}>
          <OrderTracker statusId={order.status} />
          <div className="order-info">
            <div className="order-info__block">
              <div className="order-info__block-group">
                <span
                  className="--order-header__info-bold"
                  title={`${order.contacts.firstName} ${order.contacts.lastName}`}
                >
                  {order.contacts.firstName} {order.contacts.lastName}
                </span>
                <span>
                  {order.delivery.country}, {order.delivery.city}, {order.delivery.street} {order.delivery.house},
                  {order.delivery.deliveryPoint}
                </span>
              </div>
              <span>
                {order.contacts.phone}, <a href={`mailto:${order.contacts.email}`}>{order.contacts.email}</a>
              </span>
            </div>
            <div className="order-info__block">
              <div className="order-info__block-group">
                <span className="--order-header__info-bold">
                  {order.shipping.provider} {tr.get('orders.delivery')}
                </span>
                <span>
                  #1, {tr.get('orders.pointOfIssue')}: {order.delivery.pointOfIssue}
                </span>
              </div>
              {/*<span className="--order-header__info-bold">**7221</span>*/}
            </div>
          </div>
          <div className="order__cards">
            {order.products.map((product) => (
              <OrderCard key={product.id} product={product.$info} />
            ))}
          </div>
          {product && (
            <a className="btn --primary" href={tr.link(`/cart/order/${order.id}?=review`)}>
              {tr.get('orders.leaveReview')}
            </a>
          )}
        </div>
      </Accordion>
    </div>
  );
};

export default OrderItem;
