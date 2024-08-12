import { ProductCart } from './ProductCart';
import { OwnerInfo } from '../../product/models/OwnerInfo';
import { Product } from '../../product/models/Product.abstract';
import { Currency } from '../../payment/model/currency.enum';
import { SuggestPriceStatus } from './SuggestPriceStatus.enum';

export class PreCheckoutItem {
  public readonly product: Product<any>;

  public quantity: number;

  public price: number;

  public currency: Currency;

  public total: number;

  public isSuggestedPrice: boolean;

  public suggestApplied: boolean;

  constructor(pc: ProductCart) {
    this.product = pc.product;
    this.quantity = pc.quantity;
    this.isSuggestedPrice = !!pc.suggestedPrice;
    this.suggestApplied = this.isSuggestedPrice && pc.status === SuggestPriceStatus.Accepted;
    this.price = this.isSuggestedPrice ? pc.suggestedPrice || pc.product.price : pc.product.price;
    this.currency = pc.product.currency;
    this.total = this.price * this.quantity;
  }
}

export class PreCheckout {
  public seller: OwnerInfo;

  public readonly items: PreCheckoutItem[];

  public productsCount = 0;

  public total = 0;

  public currency: Currency = Currency.USD;

  constructor(items: ProductCart[]) {
    this.items = (items || []).map((pc) => {
      const item = new PreCheckoutItem(pc);
      this.productsCount += item.quantity;
      this.total += item.total;
      return item;
    });
  }

  forSeller(seller: OwnerInfo): this {
    this.seller = seller;
    this.currency = this.seller?.currency || this.items?.[0]?.currency || Currency.USD;
    return this;
  }
}
