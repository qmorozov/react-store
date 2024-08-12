import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class WatchFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.watch.version',
    position: 1,
    visible: true,
  })
  readonly version = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.watch.body_material',
    group: true,
    visible: true,
  })
  readonly body_material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.watch.combined_materials',
    group: true,
    visible: true,
  })
  readonly combined_materials = ProductFilter.MultiSelect();

  @FilterInfo({
    forParent: true,
    title: 'filter.watch.customFeatures',
    group: true,
    visible: true,
    tip: 'filter.watch.customFeatures.tip',
  })
  readonly customFeatures = ProductFilter.Switch(false, true);

  @FilterInfo({
    title: 'filter.watch.color_of_body',
    visible: false,
  })
  readonly color_of_body = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'coating',
    visible: false,
  })
  readonly coating = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.watch.body_shape',
    visible: false,
  })
  readonly body_shape = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.watch.dial_color',
    visible: false,
  })
  readonly dial_color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.watch.type_of_indication',
    visible: false,
  })
  readonly type_of_indication = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.watch.bracelet_or_strap',
    visible: false,
  })
  readonly bracelet_or_strap = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.watch.material',
    visible: false,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.watch.mechanism_type',
    visible: false,
  })
  readonly mechanism_type = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.watch.glass',
    visible: false,
  })
  readonly glass = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.watch.water_protection',
    visible: false,
  })
  readonly water_protection = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.watch.width',
    visible: false,
    range: true,
  })
  readonly width = ProductFilter.Range(10, 90);

  @FilterInfo({
    title: 'filter.watch.height',
    visible: false,
    range: true,
  })
  readonly height = ProductFilter.Range(10, 90);
}
