import { Currency } from './currency.enum';

interface iCurrencyInfo {
  symbol?: string;
}

export const CurrencyInfo: Record<Currency, iCurrencyInfo> = {
  [Currency.USD]: {
    symbol: '$',
  },
};

export function getCurrencySymbol(currency: Currency): string {
  return CurrencyInfo[currency]?.symbol || currency;
}
