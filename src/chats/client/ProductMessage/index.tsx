import { FC } from 'react';
import { formatTime, getStatusString } from '../ChatListItem';
import MessageMeta from '../MessageMeta';
import { useTranslations } from '../../../translation/translation.context';
import { getCurrencySymbol } from '../../../payment/model/currency.info';

interface IProductMessage {
  message: any;
}

const ProductMessage: FC<IProductMessage> = ({ message }) => {
  const tr = useTranslations();

  const { product } = message;

  const image =
    product?.images?.find((img) => img.id === product.cover)?.small ||
    (product?.images?.length > 0 ? product?.images[0].small : '/images/box.jpg');

  return (
    <a
      href={tr.link(`product/${message.product.url}`)}
      className={`message__product ${message.isFromCurrentUser ? '--own-message' : ''}`}
    >
      <img src={image} alt={product.title} />

      <div className="message__product-info">
        <p className="message__product-title">{product.title}</p>
        <p className="message__product-description">{product.description}</p>
        <span className="message__product-year">{product.year}</span>
        <div className="message__product-price">
          {product.price}
          <span>{getCurrencySymbol(product.currency)}</span>
        </div>
        <MessageMeta sentAt={formatTime(message.createdAt)} status={getStatusString(message.status)} />
      </div>
    </a>
  );
};

export default ProductMessage;
