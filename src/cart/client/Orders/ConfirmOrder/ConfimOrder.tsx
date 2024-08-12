import { FC } from 'react';
import FormControl from '../../../../layouts/shared/FormControl';
import { useTranslations } from '../../../../translation/translation.context';
import { getCurrencySymbol } from '../../../../payment/model/currency.info';
import { Currency } from '../../../../payment/model/currency.enum';
import { IShipping } from '../../checkout.client';

interface IConfirmOrder {
  register: any;
  errors: any;
  productCount: number;
  totalPrice: number;
  currency: Currency;
  shippingService: IShipping;
}

enum Field {
  Agree = 'agree',
}

const ConfirmOrder: FC<IConfirmOrder> = ({ shippingService, register, errors, productCount, totalPrice, currency }) => {
  const tr = useTranslations();
  const Total = totalPrice + shippingService.price;

  return (
    <div className="confirm-order">
      <dl className="confirm-order__content">
        <div className="list-info">
          <div>
            <dt>
              <span>
                {productCount} {tr.get('checkout.productCount')}:
              </span>
            </dt>
            <dd>
              <span className="list-info__price-number">
                {totalPrice}
                <span className="list-info__price-currency">{getCurrencySymbol(currency)}</span>
              </span>
            </dd>
          </div>
        </div>
        <div className="list-info">
          <div>
            <dt>
              <span>{tr.get('checkout.orderDelivery')}:</span>
            </dt>
            <dd>
              <span className="list-info__price-number">
                {shippingService.price}
                <span className="list-info__price-currency">{getCurrencySymbol(shippingService.currency)}</span>
              </span>
            </dd>
          </div>
        </div>
        <div className="list-info">
          <div>
            <dt>
              <span>{tr.get('checkout.deliveryDate')}:</span>
            </dt>
            <dd>
              <span>May 23-26</span>
            </dd>
          </div>
        </div>
        <div className="list-info">
          <div>
            <dt>
              <span>{tr.get('checkout.total')}:</span>
            </dt>
            <dd>
              <span className="list-info__price-number">
                {Total}
                <span className="list-info__price-currency">{getCurrencySymbol(currency)}</span>
              </span>
            </dd>
          </div>
        </div>
      </dl>

      <div className="confirm-order__footer">
        <button className="btn --primary">{tr.get('checkout.confirm')}</button>

        <FormControl
          type="checkbox"
          error={errors(Field.Agree)}
          classes={!!errors(Field.Agree) && 'field-error-wrapper'}
          placeholder={
            <>
              <>{tr.get('checkout.agree')} </>
              <a>{tr.get('checkout.agreeLink')}</a>
              <> {tr.get('checkout.and')} </>
              <a>{tr.get('checkout.agreeLink2')}</a>
            </>
          }
        >
          <input type="checkbox" defaultChecked {...register(Field.Agree)} />
        </FormControl>
      </div>
    </div>
  );
};

export default ConfirmOrder;
