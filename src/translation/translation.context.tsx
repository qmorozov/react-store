import React from 'react';
import type { TranslationProvider } from '../app/language/translation.provider';

export const TranslationContext = React.createContext<TranslationProvider>(undefined);

export function useTranslations() {
  return React.useContext(TranslationContext);
}
