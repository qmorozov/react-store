import { FC } from 'react';
import { QueryBuilder } from '../../../app/services/query-builder';
import { ProductSorting } from '../../models/product.sorting.enum';
import { Product } from '../../../product/models/Product.abstract';
import { Category } from '../../../product/models/category.entity';
import { PaginationService } from '../../service/pagination.service';
import { useTranslations } from '../../../translation/translation.context';
import ProductCard from '../ProductCard';

interface IShopOfferPage {
  category: Category;
  pageQuery: QueryBuilder;
  products: Product<any>[];
  pagination: PaginationService;
}

const ShopOfferPage: FC<IShopOfferPage> = ({ pagination, category, products, pageQuery }) => {
  const tr = useTranslations();

  const catalogSorting = Object.entries({
    [ProductSorting.Rating]: tr.get('catalog.byRating'),
    [ProductSorting.PriceCheap]: tr.get('catalog.cheapExpensive'),
    [ProductSorting.PriceExpensive]: tr.get('catalog.expensiveCheap'),
  }).map(([id, value]) => ({
    id,
    link: pageQuery?.extendLink({ sort: id }),
    label: value,
  }));

  const currentSort = (catalogSorting.find((i) => i.id === pageQuery?.get('sort')) || catalogSorting[0])?.link;

  const pages = pagination?.generate();

  return (
    <>
      <div className="catalog__settings">
        <button className="catalog__settings-filter btn --dark">
          {tr.get('catalog.filter')}
          <i className="icon icon-filter" />
        </button>
        <select data-select-redirect className="catalog__settings-select btn --right-line" defaultValue={currentSort}>
          {catalogSorting.map(({ link, label }) => (
            <option value={link} key={link}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="catalog__content">
        <aside className="catalog__filter-form">
          <div id="filter-root" data-product-type={category?.productType}></div>
        </aside>
        {products.length ? (
          <ul className="catalog__products">
            {products.map((product) => {
              return (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="no-info">
            <h2>{tr.get('catalog.thisSellerHasNoProducts')}</h2>
            <p>{tr.get('catalog.selectAnotherSellerOrACategory')}</p>
          </div>
        )}
      </div>

      {!!pages?.length && (
        <ul className="pagination">
          {(pages || []).map((page, index) => {
            return (
              <li key={index} className={page.current ? 'pagination__active' : ''}>
                {page?.link ? <a href={page?.link}>{page.page}</a> : <span>{page.page}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default ShopOfferPage;
