import { useState } from 'react';
import { RenderClientPage } from '../../app/client/render-client-page';
import { TranslationContext } from '../../translation/translation.context';
import { Translations } from '../../translation/translation.provider.client';
import { ClientCart } from './cart.service.client';
import { redirectToAuth } from '../../app/client/helper.client';
import { AccountServiceClient } from '../../user/client/account.service.client';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import CurrentUser from '../../user/client/user.service.client';
import Breadcrumbs from '../../layouts/shared/Breadcrumbs';
import CartGroup from './CartGroup';

import './style/cart.client.scss';

(async () => {
  const translation = await Translations.load('cart', 'priceSuggest', 'error');

  const shopUuid = AccountServiceClient.get().type === ProductOwner.Shop && AccountServiceClient.get().uuid;

  const cartInfo = await ClientCart.listen().then(() => ClientCart.getCart(shopUuid));

  redirectToAuth(CurrentUser);

  return RenderClientPage(() => {
    const breadcrumbs = [{ title: translation.get('cart.Cart') }];
    const [cartData, setCartData] = useState(cartInfo);

    const removeCard = async (productId) => {
      try {
        await ClientCart.removeFromCart(productId).then((cartData) => {
          setCartData(cartData);
        });
      } catch (error) {
        console.log(error);
      }
    };

    const updateQuantity = async (productId, quantity) => {
      try {
        const newCartData = await ClientCart.updateQuantity(productId, { quantity });
        setCartData(newCartData.orders);
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <TranslationContext.Provider value={translation}>
        <Breadcrumbs crumbs={breadcrumbs} />
        <section className="cart-container --small">
          <h1 className="cart__title">{translation.get('cart.Cart')}</h1>
          {cartData.length > 0 ? (
            <div className="cart__wrapper">
              {cartData.map((cartItem, index) => (
                <CartGroup key={index} cartItem={cartItem} removeCard={removeCard} updateQuantity={updateQuantity} />
              ))}
            </div>
          ) : (
            <div className="no-info">
              <h2>{translation.get('cart.noInfo.title')}</h2>
              <p>{translation.get('cart.noInfo.subTitle')}</p>
            </div>
          )}
        </section>
      </TranslationContext.Provider>
    );
  });
})();
