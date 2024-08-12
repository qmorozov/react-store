import { Model } from '../../app/models/entity-helper';
import { Currency } from '../../payment/model/currency.enum';

export class ShippingMethod extends Model {
  constructor(
    public provider: string,
    public name: string,
    public price: number,
    public currency: Currency = Currency.USD,
  ) {
    super();
  }
}
