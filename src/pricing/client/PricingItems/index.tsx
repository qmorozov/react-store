import { FC } from 'react';
import { useTranslations } from '../../../translation/translation.context';
import { IPricingPlan, ISubscription } from '../pricing.client';
import { PricingPeriod } from '../../models/PricingPeriod.enum';
import { getCurrencySymbol } from '../../../payment/model/currency.info';
import { getPeriodPriceName } from '../../models/PricingPlanPeriod.abstract';
import { usePaymentContext } from '../../../payment/client/hooks/usePayment.client';
import { redirectToAuth } from '../../../app/client/helper.client';
import { ProductOwner } from '../../../product/models/Product.owner.enum';
import CurrentUser from '../../../user/client/user.service.client';

interface IPricingItems {
  pricingItems: IPricingPlan[];
  period: PricingPeriod;
  subscription: ISubscription;
}

const PricingItems: FC<IPricingItems> = ({ subscription, pricingItems, period }) => {
  const tr = useTranslations();
  const payment = usePaymentContext();

  const handlePay = (plan: IPricingPlan) => {
    if (!CurrentUser.signed) {
      redirectToAuth(CurrentUser);
      return;
    }
    payment.pay(plan, period, ProductOwner.Shop === plan.type);
  };

  return (
    <div className="pricing__items">
      {pricingItems.map((plan: IPricingPlan, index: number) => (
        <div className={`pricing__item ${index === pricingItems.length - 1 ? '--highlight' : ''}`} key={plan.id}>
          <span className="pricing__item-title">{plan.title}</span>
          {subscription?.planId === plan?.id && (
            <p className="pricing__item-expiration">
              {tr.get('pricing.activeUntil')}:
              <span>
                {new Intl.DateTimeFormat(tr.language, {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(new Date(subscription?.until))}
              </span>
            </p>
          )}
          <p className="pricing__item-text" dangerouslySetInnerHTML={{ __html: plan.description }}></p>
          <div className="pricing__item-number">
            {plan[getPeriodPriceName(period)]}
            <span>{getCurrencySymbol(plan.currency)}</span>
          </div>
          <button
            onClick={() => handlePay(plan)}
            className={`btn ${index === pricingItems.length - 1 ? '--primary' : '--light'}`}
          >
            {subscription?.planId === plan?.id ? tr.get('pricing.ExtendThePlan') : tr.get('pricing.Buy')}
          </button>
          <ul className="pricing__item-benefits">
            <li>
              {tr.get('pricing.MaxProducts')}: {plan.max_products}
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PricingItems;
