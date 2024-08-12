import { forwardRef, ReactNode, Ref, useContext, useImperativeHandle, useRef } from 'react';
import {
  Bag,
  Belt,
  Bracelet,
  Coin,
  Glasses,
  Necklace,
  Ring,
  Wallet,
  Watch,
  Diamonds,
  LabGrownDiamonds,
  NaturalDiamond,
  Earrings,
  TieClip,
  Cufflinks,
  BagCharms,
  JewellerySets,
  Pens,
  KeyChain,
  Pendants,
  PinsBrooches,
} from '../ProductDetails';
import { FilterAttributes } from '../manageProductContext';
import { IProductData } from '../../manageProduct.client';
import { useTranslations } from '../../../../translation/translation.context';

interface IDetails {
  productData: IProductData;
  isSuggestProduct: boolean;
  setDetails: (details: object) => void;
}

export interface IDetailsItem {
  attributes: any;
  productData: IProductData;
  buttons?: ReactNode;
  saveForNow?: () => void;
  detailsFormRef?: Ref<any>;
  isSuggestProduct: boolean;
  setDetails: (details: object) => void;
}

const components = {
  bag: Bag,
  ring: Ring,
  belt: Belt,
  coin: Coin,
  watch: Watch,
  wallet: Wallet,
  glasses: Glasses,
  bracelet: Bracelet,
  necklace: Necklace,
  diamond: Diamonds,
  'lab-grown-diamond': LabGrownDiamonds,
  'natural-diamond': NaturalDiamond,
  earrings: Earrings,
  'jewellery-sets': JewellerySets,
  pendants: Pendants,
  'pins-brooches': PinsBrooches,
  pens: Pens,
  cufflinks: Cufflinks,
  'bag-charms': BagCharms,
  'tie-clip': TieClip,
  'key-chain': KeyChain,
};

const Details = forwardRef(({ setDetails, isSuggestProduct, productData }: IDetails, ref) => {
  const tr = useTranslations();

  const detailsFormRef = useRef(null);

  const [attributes] = useContext(FilterAttributes);
  const Component = components[productData.productType];

  const handleSubmit = (data) => {
    if (detailsFormRef.current) {
      return detailsFormRef.current.handleSubmit(data);
    }
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit,
    isValid: () => {
      if (detailsFormRef.current && detailsFormRef.current.isValid) {
        return detailsFormRef.current.isValid();
      }
      return false;
    },
  }));

  return (
    <>
      <h2 className="form__title">{tr.get('manageProduct.tabsTitle.details')}</h2>
      {Component && (
        <Component
          ref={detailsFormRef}
          setDetails={setDetails}
          attributes={attributes}
          productData={productData}
          isSuggestProduct={isSuggestProduct}
        />
      )}
    </>
  );
});

export default Details;
