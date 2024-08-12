import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class LabGrownDiamondFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.diamond.kind',
    visible: false,
  })
  kind = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.diamond.cut',
    visible: false,
  })
  cut = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.diamond.clarity',
    visible: false,
    range: true,
  })
  clarity = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.diamond.colorGrade',
    visible: false,
  })
  colorGrade = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.diamond.carat',
    visible: false,
  })
  carat = ProductFilter.Range(0.3, 3000);

  @FilterInfo({
    title: 'filter.diamond.shape',
    visible: false,
  })
  readonly shape = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.diamond.fluorescence',
    visible: false,
  })
  readonly fluorescence = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.diamond.lwRatio',
    visible: false,
    range: true,
  })
  lwRatio = ProductFilter.Range(0, 3);

  @FilterInfo({
    title: 'filter.diamond.cutScore',
    visible: false,
    range: true,
  })
  cutScore = ProductFilter.Range(5, 10);

  @FilterInfo({
    title: 'filter.diamond.table',
    visible: false,
    range: true,
  })
  table = ProductFilter.Range(0, 100);

  @FilterInfo({
    title: 'filter.diamond.depth',
    visible: false,
    range: true,
  })
  depth = ProductFilter.Range(0, 100);
}
