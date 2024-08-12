import { FC } from 'react';
import { Currency } from 'src/payment/model/currency.enum';
import { Product } from '../../../../product/models/Product.abstract';
import { getCurrencySymbol } from '../../../../payment/model/currency.info';
import { useTranslations } from '../../../../translation/translation.context';
import { ProductSex } from '../../../../product/models/Product.sex.enum';

interface ICheckoutItems {
  cart: {
    price: number;
    currency: Currency;
    product: Product<any>;
  }[];
}

const CheckoutItems: FC<ICheckoutItems> = ({ cart }) => {
  const tr = useTranslations();

  return (
    <div className="checkout-cart">
      {cart.map(({ product, price, currency }) => (
        <a href={tr.link(`/product/${product?.url}`)} className="checkout-cart__item" key={product?.id}>
          <div className="checkout-cart__img">
            <img src={product.images ? product?.images[0]?.small : '/images/box.jpg'} alt={product.title} />
          </div>
          <div className="checkout-cart__info">
            <div className="checkout-cart__description">
              <span className="checkout-cart__name">{product.title}</span>
              <span>{product.description}</span>
              <span>{product.serialNumber},</span>
              <span>{ProductSex[product.sex]},</span>
              <span className="checkout-cart__year">{product.year}</span>
            </div>
            <div className="checkout-cart__price">
              {price}
              <span>{getCurrencySymbol(currency)}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default CheckoutItems;
