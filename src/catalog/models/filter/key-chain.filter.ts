import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class KeyChainFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.keyChain.size',
    visible: false,
  })
  readonly size = ProductFilter.Range(0, 30);

  @FilterInfo({
    title: 'filter.keyChain.shape',
    visible: false,
  })
  readonly shape = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.keyChain.color',
    visible: false,
  })
  readonly color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.keyChain.material',
    visible: false,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.keyChain.gemstones',
    visible: false,
  })
  readonly gemstones = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.keyChain.engraving',
    visible: false,
  })
  readonly engraving = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.keyChain.packing',
    visible: false,
  })
  readonly packing = ProductFilter.MultiSelect();
}
