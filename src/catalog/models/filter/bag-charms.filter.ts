import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class BagCharmsFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.bagCharms.size',
    visible: false,
  })
  readonly size = ProductFilter.Range(1, 30);

  @FilterInfo({
    title: 'filter.bagCharms.material',
    visible: false,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.bagCharms.combined_materials',
    visible: false,
  })
  readonly combined_materials = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.bagCharms.color',
    visible: false,
  })
  readonly color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.bagCharms.gemstones',
    visible: false,
  })
  readonly gemstones = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.bagCharms.art',
    visible: false,
  })
  readonly art = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.bagCharms.packing',
    visible: false,
  })
  readonly packing = ProductFilter.MultiSelect();
}
