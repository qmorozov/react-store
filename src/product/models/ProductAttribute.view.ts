import { ProductAttributes } from './ProductAttributes';

export class ProductAttributeView {
  public readonly attribute: string;
  public readonly value: string;
  public readonly name: string;
  public readonly title: string;

  constructor(key: string, value: ProductAttributes | unknown, label?: string) {
    if (value instanceof ProductAttributes) {
      this.attribute = value?.attribute || key;
      this.value = value?.value;
      this.name = value?.name;
    } else {
      this.attribute = key;
      this.value = String(value);
      this.name = String(value);
    }
    this.title = label;
  }
}
