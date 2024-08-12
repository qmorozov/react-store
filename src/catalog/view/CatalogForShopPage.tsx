import { AppInfo } from '../../app/models/app-info';
import { Category } from '../../product/models/category.entity';
import { Product } from '../../product/models/Product.abstract';
import { PaginationService } from '../service/pagination.service';
import { QueryBuilder } from '../../app/services/query-builder';
import { OwnerInfo } from '../../product/models/OwnerInfo';
import { OwnerInfoPageType } from '../models/OwnerInfoPageType.enum';
import { TranslationContext } from '../../translation/translation.context';
import Breadcrumbs from '../../layouts/shared/Breadcrumbs';
import ShopOfferPage from './ShopPageTabs/ShopOfferPage';
import ShopAboutPage from './ShopPageTabs/ShopAboutPage';

const CatalogForShopPage = (
  appInfo: AppInfo,
  seller: OwnerInfo,
  showType: OwnerInfoPageType,
  pageQuery?: QueryBuilder,
  category?: Category,
  products?: Product<any>[],
  pagination?: PaginationService,
): JSX.Element => {
  const { name, link, isOnline, image, uuid, type } = seller;

  const breadcrumbs = [{ title: category?.name || name }];

  const sellerCatalogUrl = appInfo.translation.link([link, OwnerInfoPageType.Catalog]);
  const sellerAboutUrl = appInfo.translation.link([link, OwnerInfoPageType.About]);

  return (
    <TranslationContext.Provider value={appInfo.translation}>
      <Breadcrumbs crumbs={breadcrumbs} />

      <section className="catalog-container --account">
        <div className="catalog-account-container --small">
          <h1 className="catalog__title">{name}</h1>

          <p className="catalog__seller-status">
            {appInfo.translation.get(isOnline ? 'catalog.online' : 'catalog.offline')}
          </p>

          <div className="catalog__seller-logo" title={name}>
            {image ? <img src={image} alt={name} /> : name.charAt(0)}
            {isOnline && <span className="catalog__seller-logo__status"></span>}
          </div>

          <div className="catalog__seller-pages">
            <a className={appInfo.url.includes(OwnerInfoPageType.Catalog) ? '--active' : ''} href={sellerCatalogUrl}>
              {appInfo.translation.get('catalog.offers')}
            </a>
            <a className={appInfo.url.includes(OwnerInfoPageType.About) ? '--active' : ''} href={sellerAboutUrl}>
              {appInfo.translation.get('catalog.about')}
            </a>
          </div>

          <a className="btn --primary catalog__seller-start-chat" href={`/chats/open?uuid=${uuid}&type=${type}`}>
            {appInfo.translation.get('catalog.sendAMessage')}
          </a>
        </div>
        {showType === OwnerInfoPageType.Catalog && (
          <ShopOfferPage pageQuery={pageQuery} category={category} products={products} pagination={pagination} />
        )}
      </section>
      {showType === OwnerInfoPageType.About && (
        <section className="catalog-account-info">
          <ShopAboutPage seller={seller} />
        </section>
      )}
    </TranslationContext.Provider>
  );
};

export default CatalogForShopPage;
