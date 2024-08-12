import { FC } from 'react';
import { getCurrencySymbol } from '../../../payment/model/currency.info';
import { useTranslations } from '../../../translation/translation.context';
import { OwnerInfoPageType } from '../../models/OwnerInfoPageType.enum';

interface IProductCard {
  product?: any;
  likeHandle?: () => void;
}

const ProductCard: FC<IProductCard> = ({ product, likeHandle }) => {
  const tr = useTranslations();

  const image =
    product?.images?.find((img) => img.id === product.cover)?.small ||
    (product?.images?.length > 0 ? product?.images[0].small : '/images/box.jpg');

  return (
    <div className="product-card">
      <a className="product-card__img" href={tr.link(`/product/${product?.url}`)}>
        <img src={image} alt={product?.title} title={product?.title} />
        <button
          onClick={(event) => {
            event.preventDefault();
            likeHandle();
          }}
          data-product-favorite={product?.id}
          className={`product-card__like ${product?.$isFavorite ? ' --liked' : ''}`}
        >
          <i className="icon icon-heart-fill"></i>
        </button>
      </a>
      <div className="product-card__header">
        <a className="product-card__header-seller" href={tr.link([product.$owner.link, OwnerInfoPageType.Catalog])}>
          <span>
            <div className="product-card__seller">
              {product.$owner.image ? (
                <img src={product?.$owner.image} alt={product.$owner.name} className="product-card__seller-image" />
              ) : (
                <span>{product.$owner.name.charAt(0)}</span>
              )}
              {product.$owner.name}
            </div>
          </span>
        </a>
        <div className="product-card__header-rating">
          <i className="icon icon-star"></i>
          <span>{product?.rating}</span>
        </div>
      </div>
      <a className="product-card__info" href={tr.link(`/product/${product?.url}`)}>
        <span className="product-card__info-title">{product?.title}</span>
        <p>{product?.description}</p>
        <span className="product-card__info-year">{product?.year}</span>
      </a>
      <div className="product-card__price">
        <span>{product?.price}</span>
        <span className="product-card__price-currency">{getCurrencySymbol(product?.currency)}</span>
      </div>
      {/*{true ? <span className="card__top">{tr.get('common.Top')}</span> : null}*/}
    </div>
  );
};

export default ProductCard;
