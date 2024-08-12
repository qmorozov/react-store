import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class BagFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.bag.kind',
    position: 1,
    visible: true,
  })
  readonly kind = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.bag.material',
    visible: true,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.bag.combined_materials',
    visible: true,
  })
  readonly combined_materials = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.bag.style',
    visible: false,
  })
  readonly style = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.bag.color',
    visible: false,
  })
  readonly color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.bag.size',
    visible: false,
    range: true,
  })
  readonly size = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.bag.shape',
    visible: false,
  })
  readonly shape = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.bag.clasp',
    visible: false,
  })
  readonly clasp = ProductFilter.MultiSelect();
}
