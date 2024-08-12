import { DtoValidator } from '../../app/validation/dto-validator';
import { Validator } from '../../app/validation/validator';
import { ProductDto } from './Product.dto';
import { ProductSex } from '../models/Product.sex.enum';
import { Currency } from '../../payment/model/currency.enum';
import { ProductType } from '../models/ProductType.enum';

import { RewritesCoinValidation } from '../models/coin/coin.dto.validation';
import { RewritesWatchValidation } from '../models/watch/watch.dto.validation';
import { RewritesBagValidation } from '../models/bag/bag.dto.validation';
import { RewritesBeltValidation } from '../models/belt/belt.dto.validation';
import { RewritesBraceletValidation } from '../models/bracelet/bracelet.dto.validation';
import { RewritesGlassesValidation } from '../models/glasses/glasses.dto.validation';
import { RewritesNecklaceValidation } from '../models/necklace/necklace.dto.validation';
import { RewritesRingValidation } from '../models/ring/ring.dto.validation';
import { RewritesWalletValidation } from '../models/wallet/wallet.dto.validation';
import { RewritesNaturalDiamondsValidation } from '../models/natural-diamonds/natural-diamonds.dto.validation';
import { RewritesLabGrownDiamondsValidation } from '../models/lab-grown-diamonds/lab-grown-diamonds.dto.validation';
import { RewritesEarringsValidation } from '../models/earrings/earrings.dto.validation';
import { RewritesJewellerySetsValidation } from '../models/jewellery-sets/jewellery-sets.dto.validation';
import { RewritesPendantsValidation } from '../models/pendants/pendants.dto.validation';
import { RewritesPinsBroochesValidation } from '../models/PinsBrooches/pinsBrooches.dto.validation';
import { RewritesPensValidation } from '../models/pens/pens.dto.validation';
import { RewritesCufflinksValidation } from '../models/cufflinks/cufflinks.dto.validation';
import { RewritesBagCharmsValidation } from '../models/bag-charms/bag-charms.dto.validation';
import { RewritesTieClipValidation } from '../models/tie-clip/tie-clip.dto.validation';
import { RewritesKeyChainValidation } from '../models/key-chain/key-chain.dto.validation';

const Rewrites = {
  [ProductType.Coin]: RewritesCoinValidation,
  [ProductType.Watch]: RewritesWatchValidation,
  [ProductType.Bag]: RewritesBagValidation,
  [ProductType.Belt]: RewritesBeltValidation,
  [ProductType.Bracelet]: RewritesBraceletValidation,
  [ProductType.NaturalDiamond]: RewritesNaturalDiamondsValidation,
  [ProductType.LabGrownDiamond]: RewritesLabGrownDiamondsValidation,
  [ProductType.Glasses]: RewritesGlassesValidation,
  [ProductType.Necklace]: RewritesNecklaceValidation,
  [ProductType.Ring]: RewritesRingValidation,
  [ProductType.Wallet]: RewritesWalletValidation,
  [ProductType.Earrings]: RewritesEarringsValidation,
  [ProductType.JewellerySets]: RewritesJewellerySetsValidation,
  [ProductType.Pendants]: RewritesPendantsValidation,
  [ProductType.PinsBrooches]: RewritesPinsBroochesValidation,
  [ProductType.Pens]: RewritesPensValidation,
  [ProductType.Cufflinks]: RewritesCufflinksValidation,
  [ProductType.BagCharms]: RewritesBagCharmsValidation,
  [ProductType.TieClip]: RewritesTieClipValidation,
  [ProductType.KeyChain]: RewritesKeyChainValidation,
};

export const ProductDtoValidator = new DtoValidator<ProductDto>({
  title: [Validator.required()],
  description: [Validator.required()],
  year: [
    Validator.required(),
    Validator.min(new Date().getFullYear() - 100, 'error.yearMin'),
    Validator.max(new Date().getFullYear(), 'error.yearMax'),
  ],
  price: [
    Validator.required(),
    Validator.isNumber(),
    Validator.min(1, 'error.min'),
    Validator.max(100000000, 'error.max'),
  ],
  currency: [Validator.required(), Validator.isEnum(Currency)],
  canSuggestPrice: [],
  brandId: [Validator.required(), Validator.isNumber()],
  model: [Validator.required()],
  sex: [Validator.required(), Validator.isEnum(ProductSex)],
  serialNumber: [Validator.required()],
  referenceNumber: [],
  customFeatures: [Validator.minLength(1), Validator.maxLength(120)],
  condition: [Validator.required()],
});

export const SubProductDtoValidator = new DtoValidator<any>({
  canSuggestPrice: [],
  condition: [Validator.required()],
  price: [Validator.required(), Validator.min(1, 'error.min'), Validator.max(100000000, 'error.max')],
});

export function updatedProductDtoValidator(productType: ProductType): {
  validation: DtoValidator<ProductDto>;
  visibility: Record<keyof ProductDto, boolean>;
} {
  const rewriteByProductType = Rewrites[productType];
  if (!rewriteByProductType) {
    throw new Error(`Product type ${productType} is not supported`);
  }

  const visibility = {};
  const validation = new DtoValidator<ProductDto>(
    Object.entries(ProductDtoValidator.fields).reduce(
      (validatorFields, [key, validators]) => {
        visibility[key as keyof ProductDto] = !!rewriteByProductType?.[key].visible;
        if (visibility[key as keyof ProductDto]) {
          validatorFields[key as keyof ProductDto] = rewriteByProductType?.[key]?.validation || validators;
        }
        return validatorFields;
      },
      {} as Record<keyof ProductDto, any>,
    ),
  );

  return { validation, visibility: visibility as Record<keyof ProductDto, boolean> };
}
