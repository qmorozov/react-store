import { useEffect, useState } from 'react';
import { RenderClientPage } from '../../app/client/render-client-page';
import { TranslationContext } from '../../translation/translation.context';
import { Translations } from '../../translation/translation.provider.client';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { PricingApi } from './pricing.api.client';
import { PricingPeriod } from '../models/PricingPeriod.enum';
import { Currency } from '../../payment/model/currency.enum';
import { PaymentContext, PaymentPopup, usePayment } from '../../payment/client/hooks/usePayment.client';
import { ShopApi } from '../../shop/client/shop.api.client';
import { ToastContainer } from 'react-toastify';
import { useNotification } from '../../admin/hooks/useNotification';
import { AccountServiceClient } from '../../user/client/account.service.client';
import Tabs, { Tab } from '../../layouts/shared/Tabs';
import Breadcrumbs from '../../layouts/shared/Breadcrumbs';
import Loader from '../../layouts/shared/Loader';
import Pricing from './Pricing';
import MessagePanel from '../../layouts/shared/MessagePanel';

import './style/pricing.client.scss';
import 'react-toastify/dist/ReactToastify.css';

export interface IPricingPlan {
  id: number;
  title: string;
  description: string;
  price_month: number;
  price_year: number;
  max_products: number;
  type: ProductOwner;
  currency: Currency;
}

export interface ISubscription {
  foreignId: number;
  id: number;
  period: string;
  planId: number;
  startedAt: string;
  status: number;
  type: number;
  until: string;
}

export interface IPricingPlans {
  pricingPlans: IPricingPlan[];
}

(async () => {
  const translation = await Translations.load('pricing', 'common', 'error');
  const params = new URLSearchParams(window?.location.search);
  const clientSecret = params.get('payment_intent_client_secret');
  const paymentIntent = params.get('payment_intent');

  const activeUser = AccountServiceClient.get();
  const pricingPlans = await PricingApi.getPricingPlan();

  let pricingPayment = null;
  if (clientSecret && paymentIntent) {
    try {
      pricingPayment = await PricingApi.getPricingPayment(clientSecret, paymentIntent);
    } catch (error) {
      pricingPayment = null;
    }
  }

  let subscription = null;
  if (!pricingPayment) {
    try {
      subscription =
        activeUser.signed || activeUser.isOnline
          ? await PricingApi.getCurrentPlan(activeUser.type === 1 ? activeUser.uuid : '')
          : null;
    } catch (error) {
      subscription = null;
    }
  }

  return RenderClientPage(() => {
    const breadcrumbs = [{ title: translation.get('pricing.title') }];
    const { showErrorNotification } = useNotification();
    const [plans, setPlans] = useState<IPricingPlan[]>([]);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);

    const payment = usePayment(async (plan, period, isShop = false) => {
      const { uuid } = await ShopApi.getShop();
      if (!uuid && isShop) {
        showErrorNotification(translation.get('pricing.CreateCompany'), null);
        return;
      }
      return isShop
        ? await PricingApi.buyPricingPlan(plan.id, period, uuid)
        : await PricingApi.buyPricingPlan(plan.id, period);
    });

    useEffect(() => {
      if (!plans.length) {
        setPlans(pricingPlans);
        setIsLoadingPlans(false);
      }
    }, [pricingPlans]);

    const pricingTabs: Tab[] = [
      {
        id: PricingPeriod.Month,
        title: translation.get('pricing.PerMonth'),
        content: (
          <Pricing pricingPlans={plans} period={PricingPeriod.Month} subscription={subscription?.subscription} />
        ),
      },
      {
        id: PricingPeriod.Year,
        title: translation.get('pricing.PerYear'),
        content: <Pricing pricingPlans={plans} period={PricingPeriod.Year} subscription={subscription?.subscription} />,
      },
    ];

    return (
      <TranslationContext.Provider value={translation}>
        <PaymentContext.Provider value={payment}>
          <Breadcrumbs crumbs={breadcrumbs} />
          <PaymentPopup />
          <section className="pricing-container">
            {pricingPayment && (
              <MessagePanel
                title={
                  <h1 className="pricing-subscription__title">
                    {translation.get('pricing.subscriptionActive')}:
                    <span>
                      {new Intl.DateTimeFormat(translation.language, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format(new Date(pricingPayment?.subscription.until))}
                    </span>
                  </h1>
                }
                subtitle={
                  <p className="pricing-subscription__subtitle">
                    {translation.get('pricing.purchaseInfo')}
                    <a href={`mailto:${activeUser?.email}`}> {activeUser?.email}</a>
                  </p>
                }
                close
              />
            )}
            <h1 className="pricing__title">{translation.get('pricing.title')}</h1>
            {!isLoadingPlans ? <Tabs options={pricingTabs} selectedTabId={pricingTabs[0].id} /> : <Loader relative />}
          </section>
          <ToastContainer />
        </PaymentContext.Provider>
      </TranslationContext.Provider>
    );
  });
})();
