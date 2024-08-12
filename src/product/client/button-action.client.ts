export abstract class ProductButtonAction {
  protected abstract readonly marks: Record<'active' | 'loading', string>;

  public readonly productId?: number;

  constructor(public readonly element: HTMLButtonElement, public readonly name: string) {
    this.productId = parseInt(element?.dataset?.[name], 10);
  }

  get valid() {
    return !!this.productId;
  }

  get active() {
    return this.element.classList.contains(this.marks.active);
  }

  set active(value: boolean) {
    this.element.classList.toggle(this.marks.active, value);
  }

  set loading(value: boolean) {
    this.element.classList.toggle(this.marks.loading, value);
    this.element.disabled = value;
  }
}
