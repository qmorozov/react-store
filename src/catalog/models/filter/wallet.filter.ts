import { ProductFilter } from './product.filter';
import { FilterInfo } from './filter.abstract';

export class WalletFilter extends ProductFilter {
  @FilterInfo({
    title: 'filter.wallet.material',
    position: 1,
    visible: true,
  })
  readonly material = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.wallet.clasp',
    visible: true,
  })
  readonly clasp = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.wallet.color',
    visible: false,
  })
  readonly color = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.wallet.number_of_compartments_for_bills',
    visible: false,
  })
  readonly number_of_compartments_for_bills = ProductFilter.MultiSelect();

  @FilterInfo({
    title: 'filter.wallet.number_of_compartments_for_cards',
    visible: false,
  })
  readonly number_of_compartments_for_cards = ProductFilter.MultiSelect();
}
