import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class NecklaceFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.necklace.material',
    position: 1,
    visible: true,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.necklace.coating_color',
    position: 1,
    visible: true,
  })
  readonly coating_color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.necklace.stones',
    position: 1,
    visible: false,
  })
  readonly stones = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.necklace.size',
    position: 1,
    visible: false,
  })
  readonly size = ProductFilter.MultiSelect();
}
