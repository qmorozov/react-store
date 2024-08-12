import { FC } from 'react';
import { SuggestPriceDtoValidator } from './dto/SuggestPrice.dto.validation';
import { useFormValidation } from '../../../app/validation/form-validation.hook.client';
import { useTranslations } from '../../../translation/translation.context';
import { ClientCart } from '../../../cart/client/cart.service.client';
import { Currency } from '../../../payment/model/currency.enum';
import { redirectToAuth } from '../../../app/client/helper.client';
import FormControl from '../FormControl';
import CurrentUser from '../../../user/client/user.service.client';
import CustomDialog from '../Dialog';

import './index.scss';

interface ISuggestPrice {
  productId: string | number;
  currency: Currency;
  isOpen: boolean;
  onClose: () => void;
}

enum Field {
  Price = 'price',
}

const SuggestPrice: FC<ISuggestPrice> = ({ productId, currency, isOpen, onClose }) => {
  const tr = useTranslations();

  const { register, handleSubmit, errors, setValue } = useFormValidation(SuggestPriceDtoValidator);

  const handleSuggestPrice = ({ price }) => {
    if (!CurrentUser.signed) {
      redirectToAuth(CurrentUser);
      return;
    }

    ClientCart.suggestPrice(+productId, price, Currency[currency])
      .then(() => {
        onClose();
        setValue(Field.Price, '');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <CustomDialog isOpen={isOpen} onClose={onClose} classes="suggest-price">
      <h2 className="suggest-price__title">{tr.get('priceSuggest.suggestOffer')}</h2>

      <form onSubmit={handleSubmit(handleSuggestPrice)} noValidate autoComplete="off">
        <FormControl
          type="number"
          error={errors(Field.Price)}
          translateParameters={{ min: 1, max: 100000000 }}
          placeholder={tr.get('priceSuggest.priceInput')}
        >
          <input type="number" {...register(Field.Price)} />
        </FormControl>

        <button className="btn --primary">{tr.get('priceSuggest.suggestPrice')}</button>
      </form>

      <p className="suggest-price__info">{tr.get('priceSuggest.sellerAgree')}</p>
    </CustomDialog>
  );
};

export default SuggestPrice;
