import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class CufflinksFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.cufflinks.size',
    visible: false,
  })
  readonly size = ProductFilter.Range(1, 30);

  @FilterInfo({
    title: 'filter.cufflinks.material',
    visible: false,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.cufflinks.combined_materials',
    visible: false,
  })
  readonly combined_materials = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.cufflinks.color',
    visible: false,
  })
  readonly color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.cufflinks.gemstoneType',
    visible: false,
  })
  readonly gemstoneType = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.cufflinks.cufflinkQuantity',
    visible: false,
  })
  readonly cufflinkQuantity = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.cufflinks.engraving',
    visible: false,
  })
  readonly engraving = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.cufflinks.shape',
    visible: false,
  })
  readonly shape = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.cufflinks.textured',
    visible: false,
  })
  readonly textured = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.cufflinks.type',
    visible: false,
  })
  readonly type = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.cufflinks.packing',
    visible: false,
  })
  readonly packing = ProductFilter.MultiSelect();
}
