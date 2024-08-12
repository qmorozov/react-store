import { ProductType } from '../../product/models/ProductType.enum';
import { Translations } from '../../translation/translation.provider.client';
import { CatalogApi } from './catalog.api.client';
import { getFilterByProductType } from '../models/product.filters.enum';
import { RenderClientPage } from '../../app/client/render-client-page';
import { TranslationContext } from '../../translation/translation.context';
import FilterContext from './filterContext';
import CatalogFilterForm from './filter/CatalogFilterForm';

export async function ProductFiltersComponent(elementId: string | HTMLElement = 'filter-root') {
  const rootElement = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;

  if (!rootElement) {
    return;
  }

  const productType = (rootElement?.dataset?.productType || undefined) as ProductType;

  const [translation, filterInfo] = await Promise.all([
    Translations.load('filter', 'common', 'error'),
    CatalogApi.getFilterInfo(productType),
  ]);

  const filter = getFilterByProductType(
    productType,
    new URLSearchParams(window.location.search).get('filter'),
  )?.setInfo(filterInfo);

  return RenderClientPage(() => {
    return (
      <TranslationContext.Provider value={translation}>
        <FilterContext.Provider value={filter}>
          <CatalogFilterForm />
        </FilterContext.Provider>
      </TranslationContext.Provider>
    );
  }, rootElement);
}
