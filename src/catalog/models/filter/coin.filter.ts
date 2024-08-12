import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class CoinFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.coin.material',
    position: 1,
    visible: true,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.coin.peculiarities',
    visible: true,
  })
  readonly peculiarities = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.coin.theme',
    visible: false,
  })
  readonly theme = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.coin.circulation',
    visible: false,
  })
  readonly circulation = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.coin.par',
    visible: false,
  })
  readonly par = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.coin.stateReward',
    visible: false,
  })
  readonly stateReward = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.coin.comesWithPacking',
    visible: false,
  })
  readonly comesWithPacking = ProductFilter.Switch();

  @FilterInfo({
    title: 'filter.coin.origin',
    visible: false,
  })
  readonly origin = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.coin.state',
    visible: false,
  })
  readonly state = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.coin.denomination',
    visible: false,
  })
  readonly denomination = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.coin.collection',
    visible: false,
  })
  readonly collection = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.coin.certificate',
    visible: false,
  })
  readonly certificate = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.coin.size',
    visible: false,
  })
  readonly size = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.coin.packingMaterial',
    visible: false,
  })
  readonly packingMaterial = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.coin.packingSize',
    visible: false,
  })
  readonly packingSize = ProductFilter.MultiSelect();
}
