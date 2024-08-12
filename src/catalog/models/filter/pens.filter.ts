import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class PensFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.pens.size',
    visible: false,
    range: true,
  })
  readonly size = ProductFilter.Range(0, 30);

  @FilterInfo({
    title: 'filter.pens.bodyColor',
    visible: false,
  })
  readonly bodyColor = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pens.bodyMaterial',
    visible: false,
  })
  readonly bodyMaterial = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pens.combined_materials',
    visible: false,
  })
  readonly combined_materials = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pens.inkColor',
    visible: false,
  })
  readonly inkColor = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.pens.inkReplaceable',
    visible: false,
  })
  readonly inkReplaceable = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.pens.engraving',
    visible: false,
  })
  readonly engraving = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.pens.vintage',
    visible: false,
  })
  readonly vintage = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.pens.rare',
    visible: false,
  })
  readonly rare = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.pens.awardCommemorative',
    visible: false,
  })
  readonly awardCommemorative = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.pens.comesWithPacking',
    visible: false,
  })
  readonly comesWithPacking = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.pens.originalCase',
    visible: false,
  })
  readonly originalCase = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.pens.tags',
    visible: false,
  })
  readonly tags = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.pens.type',
    visible: false,
  })
  readonly type = ProductFilter.MultiSelect();
}
