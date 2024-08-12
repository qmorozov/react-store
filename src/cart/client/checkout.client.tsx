import { useState } from 'react';
import { RenderClientPage } from '../../app/client/render-client-page';
import { Translations } from '../../translation/translation.provider.client';
import { redirectToAuth } from '../../app/client/helper.client';
import { TranslationContext } from '../../translation/translation.context';
import { Currency } from '../../payment/model/currency.enum';
import { OwnerInfo } from '../../product/models/OwnerInfo';
import CurrentUser from '../../user/client/user.service.client';
import Breadcrumbs from '../../layouts/shared/Breadcrumbs';
import CheckoutItems from './Orders/CheckoutItems';
import ContactInformation from './Orders/ContactInformation';
import { CheckoutApi } from './checkout.service.client';

import './style/Orders/checkout.client.scss';
import { OrderCreate } from './Orders/orderCreateContext';

interface ICart {
  currency: Currency;
  items: Array<any>;
  seller: OwnerInfo;
  total: number;
  productsCount: number;
}

export interface IShipping {
  currency: Currency;
  name: string;
  price: number;
  provider: string;
}

export interface IDeliveryFields {
  country: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  zip: string;
  deliveryPoint: string;
  pointOfIssue: string;
}

export interface IContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

(async () => {
  const translation = await Translations.load('checkout', 'common', 'error');

  const params = new URLSearchParams(window?.location.search);
  const sellerId = params.get('sellerId');
  const sellerType = params.get('sellerType');

  if (redirectToAuth(CurrentUser)) {
    return null;
  }

  const { checkout, contacts, delivery } = await CheckoutApi.getCheckoutPrepare(sellerId, Number(sellerType));
  const shipping = await CheckoutApi.getShipping(sellerId, Number(sellerType));

  return RenderClientPage(() => {
    const breadcrumbs = [
      { title: translation.get('checkout.cart'), route: translation.link('/cart') },
      { title: translation.get('checkout.checkout') },
    ];

    const [isOrderSending, setIsOrderSending] = useState(false);

    const [cart] = useState<ICart>(checkout);

    return (
      <TranslationContext.Provider value={translation}>
        <Breadcrumbs crumbs={breadcrumbs} />
        <OrderCreate.Provider value={{ setIsOrderSending }}>
          <section className={`checkout-container --small ${isOrderSending ? '--sending-data' : ''}`}>
            <h1 className="checkout__title">{translation.get('checkout.checkout')}</h1>

            <CheckoutItems cart={cart.items} />

            <ContactInformation
              sellerId={sellerId}
              sellerType={Number(sellerType)}
              cartLength={cart.productsCount}
              totalPrice={cart.total}
              currency={cart.currency}
              shipping={shipping}
              contacts={contacts}
              delivery={delivery}
            />
          </section>
        </OrderCreate.Provider>
      </TranslationContext.Provider>
    );
  });
})();
