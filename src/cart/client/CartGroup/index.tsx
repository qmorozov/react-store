import { FC, useState } from 'react';
import { useTranslations } from '../../../translation/translation.context';
import { Currency } from '../../../payment/model/currency.enum';
import { getCurrencySymbol } from '../../../payment/model/currency.info';
import SuggestPrice from '../../../layouts/shared/SuggestPrice';
import ProductListCard from '../../../layouts/shared/ProductListCard';
import { OwnerInfoPageType } from '../../../catalog/models/OwnerInfoPageType.enum';

interface ICartGroup {
  cartItem: any;
  removeCard: (productId: string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
}

const CartGroup: FC<ICartGroup> = ({ cartItem, removeCard, updateQuantity }) => {
  const tr = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState(null);
  const [productCurrency, setProductCurrency] = useState(null);

  const handleSuggestPriceClick = (productId, productCurrency) => {
    setProductId(productId);
    setProductCurrency(productCurrency);
    setIsModalOpen(true);
  };

  const handleCheckout = (cartItem) => {
    const { seller } = cartItem;
    window.location.href = tr.link(`/cart/checkout?sellerId=${seller.id}&sellerType=${seller.type}`);
  };

  return (
    <div className="cart__group">
      {cartItem.items.map(({ product, quantity }) => {
        return (
          <ProductListCard
            key={product.id}
            product={product}
            quantity
            initialQuantity={quantity}
            maxQuantity={product.quantity}
            onQuantityChange={(quantity: number) => updateQuantity(product.id, quantity)}
            headerButtons={
              <button className="product-list-card__header-btn" onClick={() => removeCard(product.id)}>
                <i className="icon icon-garbage" />
              </button>
            }
            footerButtons={[
              <a
                key="StartAChat"
                className="btn --light"
                href={tr.link(
                  `/chats/open?uuid=${cartItem.seller.uuid}&type=${cartItem.seller.type}&=product=${product.url}`,
                )}
              >
                {tr.get('cart.StartAChat')}
              </a>,
              <button
                key="SuggestAPrice"
                className="btn --dark"
                onClick={() => handleSuggestPriceClick(product.id, product.currency)}
              >
                {tr.get('cart.SuggestAPrice')}
              </button>,
            ]}
          />
        );
      })}
      <div className="cart__result">
        <a className="cart__shop" href={tr.link([cartItem.seller.link, OwnerInfoPageType.Catalog])}>
          {cartItem.seller.image ? (
            <img src={cartItem.seller.image} className="cart__shop-logo" alt={cartItem.seller.name} />
          ) : (
            <i className="cart__shop-logo" />
          )}
          <span className="cart__shop-name" title={cartItem.seller.name}>
            {cartItem.seller.name}
          </span>
          <div className="cart__shop-rating">
            <i className="icon icon-star" />
            {cartItem.seller.rating}
          </div>
        </a>
        <div className="cart__total">
          {tr.get('cart.TotalWithDelivery')}:{' '}
          <span>
            {cartItem.total} <i>{getCurrencySymbol(cartItem.currency)}</i>
          </span>
        </div>
        <button className="btn --primary" onClick={() => handleCheckout(cartItem)}>
          {tr.get('cart.Checkout')}
        </button>
      </div>

      <SuggestPrice
        isOpen={isModalOpen}
        productId={productId}
        currency={Currency[productCurrency]}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CartGroup;
