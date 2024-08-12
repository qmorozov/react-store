import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class BeltFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.belt.belt_length',
    position: 1,
    visible: true,
  })
  readonly belt_length = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.belt.material',
    position: 1,
    visible: true,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.belt.combined_materials',
    position: 1,
    visible: true,
  })
  readonly combined_materials = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.belt.clasp',
    position: 1,
    visible: false,
  })
  readonly clasp = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.belt.color',
    position: 1,
    visible: false,
  })
  readonly color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.belt.type',
    position: 1,
    visible: false,
  })
  readonly type = ProductFilter.MultiSelect();
}
