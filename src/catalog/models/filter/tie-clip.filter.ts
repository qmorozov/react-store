import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class TieClipFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.tieClip.size',
    visible: false,
  })
  readonly size = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.tieClip.material',
    visible: false,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.tieClip.type',
    visible: false,
  })
  readonly type = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.tieClip.color',
    visible: false,
  })
  readonly color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.tieClip.style',
    visible: false,
  })
  readonly style = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.tieClip.incut',
    visible: false,
  })
  readonly incut = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.tieClip.gemstoneType',
    visible: false,
  })
  readonly gemstoneType = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.tieClip.engraving',
    visible: false,
  })
  readonly engraving = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.tieClip.packing',
    visible: false,
  })
  readonly packing = ProductFilter.MultiSelect();
}
