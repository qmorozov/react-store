import React, { FC, memo, ReactNode, ReactNodeArray, useCallback, useState } from 'react';
import { getCurrencySymbol } from '../../../payment/model/currency.info';
import { ClientFavorites } from '../../../saved/client/saved.service.client';
import { useTranslations } from '../../../translation/translation.context';
import CustomSwitch from '../Switch';

interface IProductListCard {
  product: any;
  footerButtons?: ReactNode | ReactNodeArray;
  headerButtons?: ReactNode | ReactNodeArray;
  like?: boolean;
  parentTag?: string;
  quantity?: boolean;
  showLinks?: boolean;
  switchVisible?: boolean;
  onQuantityChange?: (value: number) => void;
  isProductVisible?: boolean;
  switchLabel?: string;
  defaultSwitchEnabled?: boolean;
  onSwitchChange?: (enabled: boolean) => void;
  maxQuantity?: number;
  initialQuantity?: number;
}

interface IProductListCardQuantity {
  product: any & { quantity: number };
  onQuantityChange?: (value: number) => void;
  maxQuantity?: number;
  initialQuantity?: number;
}

const ProductListCard: FC<IProductListCard> = ({
  product,
  footerButtons,
  headerButtons,
  like = false,
  parentTag = 'div',
  quantity = false,
  onQuantityChange,
  showLinks = true,
  isProductVisible = true,
  switchLabel,
  defaultSwitchEnabled,
  onSwitchChange,
  switchVisible = false,
  maxQuantity,

  initialQuantity,
}) => {
  const tr = useTranslations();

  const [isFavorite, setIsFavorite] = useState<boolean>(product.$isFavorite);

  const toggleFavorite = async () => {
    try {
      const active = isFavorite ? await ClientFavorites.remove(product.id) : await ClientFavorites.add(product.id);
      setIsFavorite(active);
    } catch (error) {
      console.error(error);
    }
  };

  const ParentTag = parentTag as keyof JSX.IntrinsicElements;
  const LinkTag = showLinks ? 'a' : 'div';

  const footerButtonsCount = Array.isArray(footerButtons) ? footerButtons.length : 1;
  const headerButtonsCount = Array.isArray(headerButtons) ? headerButtons.length : 1;

  const image =
    product?.images?.find((img) => img.id === product.cover)?.small ||
    (product?.images?.length > 0 ? product?.images[0].small : '/images/box.jpg');

  return (
    <ParentTag className={`product-list-card ${isProductVisible ? '' : '--hide'}`}>
      <LinkTag className="product-list-card__photo" href={showLinks ? tr.link(`product/${product.url}`) : null}>
        <img src={image} alt={product.title} />
      </LinkTag>

      <div className="product-list-card__info">
        {quantity && (
          <ProductListCardQuantity
            product={product}
            onQuantityChange={onQuantityChange}
            maxQuantity={maxQuantity}
            initialQuantity={initialQuantity}
          />
        )}
        {switchVisible && (
          <CustomSwitch
            label={switchLabel}
            onChange={onSwitchChange}
            classes="product-list-card__switch"
            defaultEnabled={defaultSwitchEnabled}
          />
        )}
        <LinkTag
          className="product-list-card_title"
          href={showLinks ? tr.link(`product/${product.url}`) : null}
          title={product.title}
        >
          {product.title}
        </LinkTag>
        <LinkTag className="product-list-card__description" href={showLinks ? tr.link(`product/${product.url}`) : null}>
          {product.description}
        </LinkTag>
        <span className="product-list-card__year">{product.year}</span>
        <div className="product-list-card__info-bottom">
          <div className="product-list-card__price">
            <span>{product.price}</span>
            <span className="product-list-card__price-currency">{getCurrencySymbol(product.currency)}</span>
          </div>
          {like && (
            <button className={`product-list-card__like${isFavorite ? ' --liked' : ''}`} onClick={toggleFavorite}>
              <i className="icon icon-heart-fill" />
            </button>
          )}
        </div>
      </div>

      <div
        className={`product-list-card__actions ${footerButtonsCount > 1 ? '--several-footer-btn' : ''} ${
          headerButtonsCount > 1 ? '--several-header-btn' : ''
        }`}
      >
        <div className="product-list-card__actions-header">{headerButtons}</div>
        {footerButtons}
      </div>
    </ParentTag>
  );
};

const ProductListCardQuantity = memo(
  ({ product, onQuantityChange, maxQuantity, initialQuantity }: IProductListCardQuantity) => {
    const initialQuantityValue = initialQuantity || product.quantity;
    const [quantityValue, setQuantityValue] = useState<number>(initialQuantityValue);
    const isMaxQuantityReached = maxQuantity && quantityValue >= maxQuantity;

    const handleMinusClick = useCallback(() => {
      if (quantityValue > 1) {
        setQuantityValue(quantityValue - 1);
        onQuantityChange && onQuantityChange(quantityValue - 1);
      }
    }, [quantityValue, onQuantityChange]);

    const handlePlusClick = useCallback(() => {
      if (maxQuantity && quantityValue >= maxQuantity) {
        return;
      }
      setQuantityValue(quantityValue + 1);
      onQuantityChange && onQuantityChange(quantityValue + 1);
    }, [quantityValue, onQuantityChange, maxQuantity]);

    return (
      <div className="product-list-card__quantity">
        <p>Amount:</p>
        <span>{quantityValue}</span>
        <div className="product-list-card__quantity-btn">
          {quantityValue > 0 && (
            <>
              <button className="--minus" onClick={handleMinusClick} disabled={quantityValue <= 1}>
                -
              </button>
              <button className="--plus" onClick={handlePlusClick} disabled={isMaxQuantityReached}>
                +
              </button>
            </>
          )}
        </div>
      </div>
    );
  },
);

export default ProductListCard;
