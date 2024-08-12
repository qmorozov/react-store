import { Currency } from './currency.enum';

export type Price = {
  amount: number;
  currency: Currency;
};

export function isValidPrice(price: Price): boolean {
  return !!(price?.amount > 0 && price?.currency);
}
