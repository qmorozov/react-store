import { FC } from 'react';
import { OwnerInfo } from '../../../product/models/OwnerInfo';
import { useTranslations } from '../../../translation/translation.context';

interface IShopAboutPage {
  seller: OwnerInfo;
}

const ShopAboutPage: FC<IShopAboutPage> = ({ seller }) => {
  const tr = useTranslations();
  const { rating, productsSold, since, responseTime, uuid, type, description } = seller;

  return (
    <>
      <div className="catalog-about-container --small">
        <dl className="list-info">
          <div>
            <dt>
              <span>{tr.get('catalog.rating')}:</span>
            </dt>
            <dd>{rating}</dd>
          </div>
          <div>
            <dt>
              <span>{tr.get('catalog.productsSold')}:</span>
            </dt>
            <dd>{productsSold}</dd>
          </div>
          <div>
            <dt>
              <span>{tr.get('catalog.sellerSince')}:</span>
            </dt>
            <dd>{since.getFullYear()}</dd>
          </div>
          <div>
            <dt>
              <span>{tr.get('catalog.respondsIn')}:</span>
            </dt>
            <dd>
              {responseTime} {tr.get('catalog.hours')}
            </dd>
          </div>
        </dl>
      </div>

      <div className="seller-written-container">
        <div className={`seller-written-container --small ${!description ? '--no-description' : ''}`}>
          <div id="seller-review" data-seller-uuid={uuid} data-seller-type={type}></div>
          <div className="description">
            <span className="description__title">{tr.get('catalog.description')}</span>
            <p className="description__content">{description || tr.get('catalog.noDescription')}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopAboutPage;
