import { TranslationContext } from '../../translation/translation.context';
import { RenderClientPage } from '../../app/client/render-client-page';
import { Translations } from '../../translation/translation.provider.client';
import { redirectToAuth } from '../../app/client/helper.client';
import { useEffect, useState } from 'react';
import { ShopApi } from './shop.api.client';
import { ToastContainer } from 'react-toastify';
import CurrentUser from '../../user/client/user.service.client';
import ManageShopForm from './ManageShop/ManageShopForm';

import './ManageShop/Style/manageShop.client.scss';
import 'react-toastify/dist/ReactToastify.css';

export interface IShopData {
  uuid: string;
  image: any;
  name: string;
  city: string;
  country: string;
  zipCode: string;
  vatNumber: string;
  phoneNumber: string;
  description: string;
  formOfOrganization: string;
}

(async () => {
  const translation = await Translations.load('manageShop', 'common', 'error');

  redirectToAuth(CurrentUser);

  return RenderClientPage(() => {
    const [shopData, setShopData] = useState<IShopData>();
    const [isSending, setIsSending] = useState<boolean>(false);

    useEffect(() => {
      ShopApi.getShop().then((response) => {
        setShopData(response);
      });
    }, []);

    return (
      <TranslationContext.Provider value={translation}>
        <section className={`manage-shop-container --small ${isSending ? '--sending' : ''}`}>
          <h1 className="manage-shop__title">
            {translation.get(`manageShop.${!shopData?.uuid ? 'addShop' : 'editShop'}`)}
          </h1>
          <ManageShopForm
            shopData={shopData}
            setShopData={setShopData}
            setIsSending={setIsSending}
            isChangeInfo={!!shopData?.uuid}
          />
        </section>
        <ToastContainer />
      </TranslationContext.Provider>
    );
  });
})();
