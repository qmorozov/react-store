import { useTranslations } from 'src/translation/translation.context';
import { OwnerInfoPageType } from '../../../../catalog/models/OwnerInfoPageType.enum';
import { dividerClasses } from '@mui/material';

const ProductSeller = ({ seller }) => {
  const tr = useTranslations();
  const { rating, since, isOnline, name, link, image, productsSold, responseTime } = seller;

  const sellerData = [
    {
      label: tr.get('seller.Rating'),
      value: (
        <>
          <i className="icon icon-star"></i> {rating}
        </>
      ),
    },
    { label: tr.get('seller.ProductSold'), value: productsSold },
    { label: tr.get('seller.SellerSince'), value: `${since.getFullYear()} ${tr.get('seller.Year')}` },
    { label: tr.get('seller.Responds'), value: `${responseTime} ${tr.get('seller.Hours')}` },
  ];

  return (
    <div className="product-seller">
      <span className="product__subtitle">{tr.get('seller.Seller')}</span>
      <div className="product-seller__info">
        {image ? <img src={image} alt={name} /> : <span title={name}>{name.charAt(0)}</span>}
        <a href={tr.link([link, OwnerInfoPageType.Catalog])} title={name}>
          {name}
        </a>
        <p>{tr.get(isOnline ? 'productCard.Online' : 'productCard.LastSeenRecently')}</p>
      </div>
      <dl className="list-info">
        {sellerData.map(({ label, value }) => (
          <div key={label}>
            <dt>
              <span>{label}:</span>
            </dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default ProductSeller;
