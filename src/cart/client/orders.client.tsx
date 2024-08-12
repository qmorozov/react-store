import { RenderClientPage } from '../../app/client/render-client-page';
import { TranslationContext } from '../../translation/translation.context';
import { Translations } from '../../translation/translation.provider.client';
import { OrdersApi } from './orders.api.client';
import Tabs, { Tab } from '../../layouts/shared/Tabs';
import OrdersBuying from './Orders/OrdersBuying';
import OrdersSelling from './Orders/OrdersSelling';

import './style/Orders/orders.client.scss';

enum OrderTabs {
  Buying = 'buying',
  Selling = 'selling',
}

(async () => {
  const translation = await Translations.load('orders', 'common', 'orderIsPlaced', 'error');

  const sellingOrders = await OrdersApi.getSellingOrders();
  const buyingOrders = await OrdersApi.getBuyingOrders();

  return RenderClientPage(() => {
    const ordersTabs: Tab[] = [
      {
        id: OrderTabs.Buying,
        title: translation.get(`orders.${OrderTabs.Buying}`),
        content: <OrdersBuying buyingOrders={buyingOrders} />,
      },
      {
        id: OrderTabs.Selling,
        title: translation.get(`orders.${OrderTabs.Selling}`),
        content: <OrdersSelling sellingOrders={sellingOrders} />,
      },
    ];

    return (
      <TranslationContext.Provider value={translation}>
        <section className="orders-container --small">
          <h1 className="orders__title">{translation.get('orders.title')}</h1>

          <Tabs options={ordersTabs} selectedTabId={ordersTabs[0].id} />
        </section>
      </TranslationContext.Provider>
    );
  });
})();
