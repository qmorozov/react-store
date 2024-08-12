import { FC } from 'react';
import { IPricingPlan, IPricingPlans, ISubscription } from '../pricing.client';
import { useTranslations } from '../../../translation/translation.context';
import { PricingPeriod } from '../../models/PricingPeriod.enum';
import Tabs, { Tab } from '../../../layouts/shared/Tabs';
import PricingItems from '../PricingItems';
import { AccountServiceClient } from '../../../user/client/account.service.client';

interface IPricing extends IPricingPlans {
  period: PricingPeriod;
  subscription: ISubscription;
}

const filterPricingPlans = (plans: IPricingPlan[], type: number) => {
  return plans.filter((plan: IPricingPlan) => plan.type === type);
};

const Pricing: FC<IPricing> = ({ subscription, pricingPlans, period }) => {
  const tr = useTranslations();
  const activeUser = AccountServiceClient.get();

  const pricingDetailTabs: Tab[] = [
    {
      id: 'user',
      title: tr.get('pricing.User'),
      content: (
        <PricingItems pricingItems={filterPricingPlans(pricingPlans, 0)} period={period} subscription={subscription} />
      ),
    },
    {
      id: 'company',
      title: tr.get('pricing.Company'),
      content: (
        <PricingItems pricingItems={filterPricingPlans(pricingPlans, 1)} period={period} subscription={subscription} />
      ),
    },
  ];

  return (
    <div className="pricing-wrapper">
      {activeUser.signed || activeUser.isOnline ? (
        activeUser.type === 0 ? (
          <PricingItems
            pricingItems={filterPricingPlans(pricingPlans, 0)}
            period={period}
            subscription={subscription}
          />
        ) : (
          <PricingItems
            pricingItems={filterPricingPlans(pricingPlans, 1)}
            period={period}
            subscription={subscription}
          />
        )
      ) : (
        <Tabs subTabs options={pricingDetailTabs} selectedTabId={pricingDetailTabs[0].id} />
      )}
    </div>
  );
};

export default Pricing;
