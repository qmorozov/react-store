import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class PinsBroochesFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.pinsBrooches.size',
    visible: false,
    range: true,
  })
  readonly size = ProductFilter.Range(0, 30);

  @FilterInfo({
    title: 'filter.pinsBrooches.type',
    visible: false,
  })
  readonly type = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pinsBrooches.material',
    visible: false,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pinsBrooches.gemstoneType',
    visible: false,
  })
  readonly gemstoneType = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pinsBrooches.packing',
    visible: false,
  })
  readonly packing = ProductFilter.MultiSelect();
}
