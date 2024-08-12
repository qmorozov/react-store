import { ApiService } from '../../app/services/api.service.client';
import { ProductButtonAction } from './button-action.client';
import { redirectToAuth } from '../../app/client/helper.client';
import CurrentUser from '../../user/client/user.service.client';

export abstract class ProductBulkActionService<B extends ProductButtonAction> extends ApiService {
  protected _inited = false;

  protected _buttons?: B[];

  protected constructor(protected readonly selector: string) {
    super();
  }

  protected abstract toButton(element: Element): B;

  protected async onClick(button: B): Promise<boolean> {
    return this.updateProductStatus(
      button.productId,
      button?.active ? this.remove(button.productId) : this.add(button.productId),
    );
  }

  protected async updateProductStatus(productId: number, status: Promise<boolean>) {
    return status.then((status) => {
      this.markButtons(productId, status);
      return status;
    });
  }

  public abstract add(productId: number): Promise<boolean>;

  public abstract remove(productId: number): Promise<boolean>;

  public async listen() {
    await this._initPage();
    this._buttons.forEach((button) => {
      button.element.addEventListener('click', (e) => {
        e?.preventDefault?.();
        if (!redirectToAuth(CurrentUser)) {
          button.loading = true;
          return this.onClick(button)
            .then((status) => {
              return (button.active = status);
            })
            .finally(() => (button.loading = false));
        }
      });
    });
  }

  protected async markButtons(productId: number, active: boolean) {
    return (this._buttons || []).forEach((b) => {
      if (b.productId === productId) {
        b.active = active;
      }
    });
  }

  protected _initPage() {
    if (!this._inited) {
      this._inited = true;
      this._buttons = Array.from(document.querySelectorAll(`[${this.selector}]`))
        .map((b) => this.toButton(b))
        .filter((b) => b.valid);
    }
  }
}
