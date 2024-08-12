import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class GlassesFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.glasses.lenses_color',
    position: 1,
    visible: true,
  })
  readonly lenses_color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.glasses.frame_color',
    position: 1,
    visible: true,
  })
  readonly frame_color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.glasses.frame_material',
    position: 1,
    visible: false,
  })
  readonly frame_material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.glasses.frame_shape',
    position: 1,
    visible: false,
  })
  readonly frame_shape = ProductFilter.MultiSelect();
}
