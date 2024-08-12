import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class JewellerySetsFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.jewellerySets.necklace',
    visible: false,
  })
  readonly necklace = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.jewellerySets.earrings',
    visible: false,
  })
  readonly earrings = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.jewellerySets.brooch',
    visible: false,
  })
  readonly brooch = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.jewellerySets.bracelet',
    visible: false,
  })
  readonly bracelet = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.jewellerySets.diadem',
    visible: false,
  })
  readonly diadem = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.jewellerySets.ring',
    visible: false,
  })
  readonly ring = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.jewellerySets.pendant',
    visible: false,
  })
  readonly pendant = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.jewellerySets.size',
    visible: false,
  })
  readonly size = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.jewellerySets.color',
    visible: false,
  })
  readonly color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.jewellerySets.material',
    visible: false,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.jewellerySets.materialCombined',
    visible: false,
  })
  readonly materialCombined = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.jewellerySets.gemstones',
    visible: false,
  })
  readonly gemstones = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.jewellerySets.mixedStones',
    visible: false,
  })
  readonly mixedStones = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.jewellerySets.gemstonesMixedStones',
    visible: false,
  })
  readonly gemstonesMixedStones = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.jewellerySets.packing',
    visible: false,
  })
  readonly packing = ProductFilter.MultiSelect();
}
