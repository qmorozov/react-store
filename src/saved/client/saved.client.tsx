import { useEffect, useState } from 'react';
import { SavedApi } from './saved.api.client';
import { RenderClientPage } from '../../app/client/render-client-page';
import { TranslationContext } from '../../translation/translation.context';
import { Translations } from '../../translation/translation.provider.client';
import { redirectToAuth } from '../../app/client/helper.client';
import CurrentUser from '../../user/client/user.service.client';
import { AccountServiceClient } from '../../user/client/account.service.client';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import Loader from '../../layouts/shared/Loader';
import Breadcrumbs from '../../layouts/shared/Breadcrumbs';
import ProductCard from '../../catalog/view/ProductCard';

import './style/saved.client.scss';

(async () => {
  const translation = await Translations.load('saved', 'common', 'error');

  redirectToAuth(CurrentUser);

  const shopUuid = AccountServiceClient.get().type === ProductOwner.Shop && AccountServiceClient.get().uuid;

  return RenderClientPage(() => {
    const breadcrumbs = [{ title: translation.get('saved.Saved') }];
    const [savedData, setSavedData] = useState<any[] | null>(null);

    useEffect(() => {
      const fetchSavedData = async () => {
        const savedInfo = await SavedApi.getSaved(shopUuid);
        setSavedData(savedInfo);
      };

      fetchSavedData();
    }, []);

    const removeFromSaved = async (productId: string): Promise<void> => {
      try {
        await SavedApi.removeFromSaved(productId);
        const saved = await SavedApi.getSaved();
        setSavedData(saved);
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <TranslationContext.Provider value={translation}>
        <Breadcrumbs crumbs={breadcrumbs} />
        <section className="saved-container --small">
          <h1 className="saved__title">{translation.get('saved.Saved')}</h1>
          {savedData ? (
            savedData.length > 0 ? (
              <div className="saved__items">
                {savedData.map((product) => (
                  <ProductCard key={product.id} product={product} likeHandle={() => removeFromSaved(product.id)} />
                ))}
              </div>
            ) : (
              <div className="no-info">
                <h2>{translation.get('saved.youHaveNoSavedItemsYet')}</h2>
                <p>{translation.get('saved.pushTheHeartButtonToSaveItemsFromListing')}</p>
              </div>
            )
          ) : (
            <Loader relative={true} />
          )}
        </section>
      </TranslationContext.Provider>
    );
  });
})();
