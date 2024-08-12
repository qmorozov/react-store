import { ProductButtonAction } from '../../product/client/button-action.client';
import { ProductBulkActionService } from '../../product/client/bulk-action.service.client';
import { Currency } from '../../payment/model/currency.enum';

class AddToCartButton extends ProductButtonAction {
  protected readonly marks = {
    loading: '--loading',
    active: '--added',
  };
}

class CartService extends ProductBulkActionService<AddToCartButton> {
  #cartCountElement?: HTMLElement;

  constructor() {
    super('data-product-cart');
  }

  protected toButton(element: Element): AddToCartButton {
    return new AddToCartButton(element as HTMLButtonElement, 'productCart');
  }

  private getApi(productId: number) {
    return CartService.url(`/product/${productId}/cart`);
  }

  private async apiResponseToActive(request: Promise<any>): Promise<boolean> {
    return request?.then((res) => {
      if (res?.data?.hasOwnProperty?.('count')) {
        this.#setCartCount(res?.data.count);
      }

      if (!res?.data?.hasOwnProperty?.('active')) {
        throw new Error('Failed');
      }

      return !!res?.data.active;
    });
  }

  async add(productId: number): Promise<boolean> {
    return this.apiResponseToActive(this.getApi(productId).post()).catch(() => false);
  }

  async suggestPrice(productId: number, price: number, currency: Currency = Currency.USD) {
    return this.apiResponseToActive(
      this.getApi(productId).post({
        price,
        currency,
      }),
    ).catch(() => false);
  }

  async remove(productId: number): Promise<boolean> {
    return this.apiResponseToActive(this.getApi(productId).delete()).catch(() => true);
  }

  async getCart(shopUuid?: string | null) {
    let url = '/cart';

    if (shopUuid) {
      url += `?shop=${shopUuid}`;
    }

    return CartService.url(url)
      .get()
      .catch(() => ({
        data: {
          count: 0,
          orders: [],
        },
      }))
      .then((r) => this._processFullCart(r));
  }

  async removeFromCart(productId: number) {
    return CartService.url(`/cart/${productId}`)
      .delete()
      .then((r) => this._processFullCart(r));
  }

  private _processFullCart(cartInfo: any) {
    this.#setCartCount(cartInfo?.data?.count || 0);
    return cartInfo?.data?.orders || [];
  }

  protected async onClick(button: AddToCartButton): Promise<boolean> {
    if (!button.active) {
      this.#updateCartCount(1);
      return super.onClick(button);
    }
    return true;
  }

  protected _initPage() {
    if (!this._inited) {
      this.#cartCountElement = document.getElementById('cart-count');
    }
    return super._initPage();
  }

  async #updateCartCount(by = 1) {
    return this.#setCartCount((parseInt(this.#cartCountElement?.innerText || '0', 10) || 0) + by);
  }

  async #setCartCount(count: number) {
    return this.#cartCountElement && (this.#cartCountElement.innerText = count.toString());
  }

  async updateQuantity(productId: string | number, quantity: any) {
    return (await CartService.url(`/cart/${productId}`).put(quantity))?.data;
  }
}

export const ClientCart = new CartService();
