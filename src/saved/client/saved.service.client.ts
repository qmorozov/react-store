import { ProductButtonAction } from '../../product/client/button-action.client';
import { ProductBulkActionService } from '../../product/client/bulk-action.service.client';

class AddToFavoritesButton extends ProductButtonAction {
  protected readonly marks = {
    loading: '--loading',
    active: '--liked',
  };
}

class FavoriteService extends ProductBulkActionService<AddToFavoritesButton> {
  constructor() {
    super('data-product-favorite');
  }

  protected toButton(element: Element): AddToFavoritesButton {
    return new AddToFavoritesButton(element as HTMLButtonElement, 'productFavorite');
  }

  private getApi(productId: number) {
    return FavoriteService.url(`/product/${productId}/favorite`);
  }

  private async apiResponseToActive(request: Promise<any>): Promise<boolean> {
    return request?.then((res) => {
      if (!res?.data?.hasOwnProperty?.('active')) {
        throw new Error('Failed');
      }
      return !!res?.data?.active;
    });
  }

  add(productId: number): Promise<boolean> {
    return this.apiResponseToActive(this.getApi(productId).post()).catch(() => false);
  }

  remove(productId: number): Promise<boolean> {
    return this.apiResponseToActive(this.getApi(productId).delete()).catch(() => true);
  }
}

export const ClientFavorites = new FavoriteService();
