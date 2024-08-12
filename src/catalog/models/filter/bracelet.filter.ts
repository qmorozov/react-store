import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class BraceletFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.bracelet.material',
    position: 1,
    visible: true,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.bracelet.coating_color',
    position: 1,
    visible: true,
  })
  readonly coating_color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.bracelet.stones',
    position: 1,
    visible: false,
  })
  readonly stones = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.bracelet.size',
    position: 1,
    visible: false,
    range: true,
  })
  readonly size = ProductFilter.MultiSelect();
}
