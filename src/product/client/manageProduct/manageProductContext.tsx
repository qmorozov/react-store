import { createContext } from 'react';
import { Tab } from '../../../layouts/shared/Tabs';

interface IBasicProvider {
  step: Tab['id'];
  productId: string | number;
  visibleTabs: any;
  currentPlanData: any;
  setStep: (step: Tab['id']) => void;
  setVisibleTabs: (visibleTabs) => void;
  showCustomFeatures: boolean;
  setShowCustomFeatures: (showCustomFeatures: boolean) => void;
}

interface ISuggestSendingProductProvider {
  isSendingData: boolean;
  isSuggestProduct: boolean;
  setIsSendingData: (isSuggestProduct: boolean) => void;
  setIsSuggestProduct: (isSuggestProduct: boolean) => void;
}

interface IEditSubProductProvider {
  editSubProduct: any;
  setEditSubProduct: (subProduct: any) => void;
}

export const FilterAttributes = createContext([]);
export const Product = createContext(null);
export const Basic = createContext<IBasicProvider>(null);
export const SuggestSendingProduct = createContext<ISuggestSendingProductProvider>(null);
export const EditSubProduct = createContext<IEditSubProductProvider>(null);
