import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class EarringsFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.watch.size',
    visible: false,
    range: true,
  })
  readonly size = ProductFilter.Range(0, 30);

  @FilterInfo({
    title: 'filter.earrings.type',
    visible: false,
  })
  readonly type = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.earrings.material',
    visible: false,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.earrings.color',
    visible: false,
  })
  readonly color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.earrings.gem',
    visible: false,
  })
  readonly gem = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.earrings.vintage',
    visible: false,
  })
  readonly vintage = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.earrings.proofOfOrigin',
    visible: false,
  })
  readonly proofOfOrigin = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.earrings.originalCase',
    visible: false,
  })
  readonly originalCase = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.earrings.cardOrCertificate',
    visible: false,
  })
  readonly cardOrCertificate = ProductFilter.Switch();
}
