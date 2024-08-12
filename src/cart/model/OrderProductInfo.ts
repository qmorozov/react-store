import { Product } from '../../product/models/Product.abstract';

export type OrderProductInfo = Pick<Product<any>, 'id' | 'type' | 'price' | 'currency'> & {
  quantity: number;
  $info?: Partial<Product<any>>;
};
