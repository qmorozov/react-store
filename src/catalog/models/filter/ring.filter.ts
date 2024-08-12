import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class RingFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.ring.material',
    position: 1,
    visible: true,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.ring.coating_color',
    position: 1,
    visible: true,
  })
  readonly coating_color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.ring.stones',
    position: 1,
    visible: false,
  })
  readonly stones = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.ring.size',
    position: 1,
    visible: false,
  })
  readonly size = ProductFilter.MultiSelect();
}
