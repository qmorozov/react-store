import { Filter, FilterInfo } from './filter.abstract';

export class ProductFilter extends Filter {
  @FilterInfo({
    title: 'filter.brand',
    visible: true,
    group: true,
  })
  readonly brand = Filter.MultiSelect([], 'id', 'brandId');

  @FilterInfo({
    title: 'filter.price',
    visible: true,
    range: true,
  })
  readonly price = Filter.Range(0, 9999999);

  @FilterInfo({
    title: 'filter.year',
    visible: true,
    range: true,
  })
  readonly year = Filter.Range(1900, new Date().getFullYear());
}
