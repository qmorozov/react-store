import { useState } from 'react';
import { RenderClientPage } from '../../app/client/render-client-page';
import { Translations } from '../../translation/translation.provider.client';
import { redirectToAuth } from '../../app/client/helper.client';
import { TranslationContext } from '../../translation/translation.context';
import CurrentUser from '../../user/client/user.service.client';
import Review from './Orders/Review/Review';
import OrderTracker from './Orders/OrderTracker';
import { OrderInfoApi } from './orderInfo.servie.client';
import MessagePanel from '../../layouts/shared/MessagePanel';
import { ToastContainer } from 'react-toastify';

import './style/Orders/orderIsPlaced.client.scss';
import 'react-toastify/dist/ReactToastify.css';

export interface IOrderInfo {
  rating: number;
  comment: 'string';
}

(async () => {
  const translation = await Translations.load('orderIsPlaced', 'common', 'error');

  const url = window.location.href;
  const orderId = url.split('/').pop().split('?')[0];

  const { status, contacts } = await OrderInfoApi.getOrder(orderId);
  const orderData = await OrderInfoApi.getOrder(orderId);
  const review = await OrderInfoApi.getOrderInfo(orderId);
  redirectToAuth(CurrentUser);

  const hasReviewParam = window.location.href.includes('?=review');

  return RenderClientPage(() => {
    const [orderInfo] = useState<IOrderInfo>(review);

    return (
      <TranslationContext.Provider value={translation}>
        <section className="order-placed-container">
          <MessagePanel
            classes={hasReviewParam ? '--has-review' : ''}
            title={
              <h1 className="order-placed__title">
                {hasReviewParam ? (
                  <>
                    {translation.get('orderIsPlaced.leaveReviewFor')} <span>{orderData.products[0].$info.title}</span>
                  </>
                ) : (
                  <>
                    {translation.get('orderIsPlaced.YourOrderHasBeenPlaced')}
                    <span> {translation.get('orderIsPlaced.YourOrderHasBeenPlacedSpan')}</span>
                  </>
                )}
              </h1>
            }
            subtitle={
              hasReviewParam ? null : (
                <p className="order-placed__subtitle">
                  {translation.get('orderIsPlaced.PurchaseInfo')}
                  <a href={`mailto:${contacts?.email}`}>{contacts?.email}</a>
                </p>
              )
            }
          />
        </section>

        <section className="order-tracker-container --small">
          <OrderTracker statusId={status} />

          <div className="order-tracker__buttons">
            <a className="btn --primary" href={translation.link('/')}>
              {translation.get('orderIsPlaced.ContinueShopping')}
            </a>
            <a className="btn --dark" href={translation.link('/chats')}>
              {translation.get('orderIsPlaced.Message')}
            </a>
          </div>
        </section>

        <section className="review-container --small">
          <Review orderInfo={orderInfo} orderId={+orderId} />
        </section>

        <ToastContainer />
      </TranslationContext.Provider>
    );
  });
})();
