import { useState } from 'react';
import { RenderClientPage } from '../../../app/client/render-client-page';
import { Translations } from '../../../translation/translation.provider.client';
import { TranslationContext } from '../../../translation/translation.context';
import { Currency } from '../../../payment/model/currency.enum';
import SuggestPrice from '../../../layouts/shared/SuggestPrice';

(async (suggestElementId) => {
  const translation = await Translations.load('priceSuggest', 'common', 'error');

  const productId = document.getElementById(suggestElementId)?.dataset?.productId;
  const productCurrency = document.getElementById(suggestElementId)?.dataset?.productCurrency;

  return RenderClientPage(() => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <TranslationContext.Provider value={translation}>
        <button className="product__price-suggest" onClick={() => setIsModalOpen(true)}>
          <i className="icon icon-price" />
          <p>{translation.get('priceSuggest.suggestPrice')}</p>
        </button>
        <SuggestPrice
          isOpen={isModalOpen}
          productId={productId}
          currency={Currency[productCurrency]}
          onClose={() => setIsModalOpen(false)}
        />
      </TranslationContext.Provider>
    );
  }, suggestElementId);
})('suggest-price');
