import Breadcrumbs from '../../layouts/shared/Breadcrumbs';
import ProductCard from './ProductCard';
import { AppInfo } from '../../app/models/app-info';
import { Category } from '../../product/models/category.entity';
import { Product } from '../../product/models/Product.abstract';
import { PaginationService } from '../service/pagination.service';
import { QueryBuilder } from '../../app/services/query-builder';
import { ProductSorting } from '../models/product.sorting.enum';

const CatalogPage = (
  appInfo: AppInfo,
  pageQuery: QueryBuilder,
  category: Category,
  products: Product<any>[],
  pagination: PaginationService,
): JSX.Element => {
  const breadcrumbs = [{ title: category?.name || appInfo.document.title }];

  const pages = pagination.generate();

  const catalogSorting = Object.entries({
    [ProductSorting.Rating]: appInfo.translation.get('catalog.byRating'),
    [ProductSorting.PriceCheap]: appInfo.translation.get('catalog.cheapExpensive'),
    [ProductSorting.PriceExpensive]: appInfo.translation.get('catalog.expensiveCheap'),
  }).map(([id, value]) => ({
    id,
    link: pageQuery.extendLink({ sort: id }),
    label: value,
  }));

  const currentSort = (catalogSorting.find((i) => i.id === pageQuery.get('sort')) || catalogSorting[0])?.link;
  return (
    <>
      <Breadcrumbs crumbs={breadcrumbs} />

      {/*<pre>{JSON.stringify(products, null, 2)}</pre>*/}

      <section className="catalog-container">
        <h1 className="catalog__title">{category?.name}</h1>
        <div className="catalog__settings">
          <button className="catalog__settings-filter btn --dark">
            {appInfo.translation.get('catalog.filter')}
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
              <h2>{appInfo.translation.get('catalog.noProductsInThisCategory')}</h2>
              <p>{appInfo.translation.get('catalog.trySelectingADifferentCategory')}</p>
            </div>
          )}
        </div>

        {!!pages.length && (
          <ul className="pagination">
            {pages.map((page, index) => {
              return (
                <li key={index} className={page.current ? '--active' : ''}>
                  {page?.link ? <a href={page?.link}>{page.page}</a> : <span>{page.page}</span>}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
};

export default CatalogPage;
