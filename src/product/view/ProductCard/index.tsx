import { FC } from 'react';
import { getCurrencySymbol } from '../../../payment/model/currency.info';
import ProductCardGallery from './components/ProductCardGallery';
import { useTranslations } from '../../../translation/translation.context';

interface IProductCard {
  condition: number | string;
  product: any;
  productVariants: Record<string, any>;
}

const ProductCard: FC<IProductCard> = ({ product, condition, productVariants }) => {
  const tr = useTranslations();

  return (
    <>
      <div className="product-main -container">
        <div className="product-main-container --small">
          <ProductCardGallery product={product} />
          <div className="product__info">
            <div className="product__info-top">
              <h1>{product.title}</h1>
              <button
                data-product-favorite={product?.id}
                className={`product__like${product.$isFavorite ? ' --liked' : ''}`}
              >
                <i className="icon icon-heart-fill"></i>
              </button>
            </div>
            <div className="product__condition">
              <span>
                {tr.get('manageProduct.Fields.MainInfo.Condition.title')}: {condition}
              </span>
            </div>
            {productVariants.length ? (
              <div className="product__sub-products">
                {productVariants.map(({ attribute, title, variants }) => (
                  <div className="product__sub-product" key={attribute}>
                    <span>{tr.get(title)}:</span>
                    <ul>
                      {variants.map(({ id, current, link, name }) => (
                        <li key={id} className={current ? '--active' : ''}>
                          <a href={tr.link(link)}>{name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="product__price">
              <span className="product__price-number">
                {product.price}
                <span>{getCurrencySymbol(product?.currency)}</span>
              </span>
              <div id="suggest-price" data-product-id={product?.id} data-product-currency={product?.currency}></div>
            </div>
            <div className="product__main-buttons">
              <button data-product-cart={product?.id} className={`btn --primary${product?.$onCart ? ' --added' : ''}`}>
                {tr.get('manageProduct.productPage.addToCart')}
              </button>
              <a
                className="btn --dark"
                href={tr.link(
                  `/chats/open?uuid=${product.$owner.uuid}&type=${product.$owner.type}&product=${product.url}`,
                )}
              >
                {tr.get('manageProduct.productPage.chat')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
