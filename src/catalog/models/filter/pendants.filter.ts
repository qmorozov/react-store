import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class PendantsFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.pendants.size',
    visible: false,
  })
  readonly size = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pendants.type',
    visible: false,
  })
  readonly type = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pendants.coating',
    visible: false,
  })
  readonly coating = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pendants.material',
    visible: false,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pendants.color',
    visible: false,
  })
  readonly color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pendants.gemstonesQuantity',
    visible: false,
  })
  readonly gemstonesQuantity = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pendants.gemstones',
    visible: false,
  })
  readonly gemstones = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pendants.mixedStones',
    visible: false,
  })
  readonly mixedStones = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.pendants.largeStones',
    visible: false,
  })
  readonly largeStones = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.pendants.gemstoneColor',
    visible: false,
  })
  readonly gemstoneColor = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pendants.incut',
    visible: false,
  })
  readonly incut = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.pendants.incutColor',
    visible: false,
  })
  readonly incutColor = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pendants.packing',
    visible: false,
  })
  readonly packing = ProductFilter.MultiSelect();
}
