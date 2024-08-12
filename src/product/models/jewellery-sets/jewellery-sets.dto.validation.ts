import { DtoValidator } from '../../../app/validation/dto-validator';
import { Validator } from '../../../app/validation/validator';
import { GeneralField } from '../ProductType.enum';
import { JewellerySetsDto } from './jewellery-sets.dto';

export const JewellerySetsDtoValidator = new DtoValidator<JewellerySetsDto>({
  necklace: [],
  earrings: [],
  brooch: [],
  bracelet: [],
  diadem: [],
  ring: [],
  pendant: [],
  size: [Validator.required()],
  material: [Validator.required()],
  color: [Validator.required()],
  materialCombined: [],
  gemstones: [Validator.required()],
  mixedStones: [],
  gemstonesMixedStones: [],
  packing: [Validator.required()],
});

export const RewritesJewellerySetsValidation: Record<GeneralField, { visible: boolean; validation?: any[] }> = {
  [GeneralField.Sex]: {
    visible: true,
  },
  [GeneralField.CanSuggestPrice]: {
    visible: true,
  },
  [GeneralField.BrandId]: {
    visible: true,
  },
  [GeneralField.Model]: {
    visible: true,
  },
  [GeneralField.Title]: {
    visible: true,
  },
  [GeneralField.Description]: {
    visible: true,
  },
  [GeneralField.Condition]: {
    visible: true,
  },
  [GeneralField.Price]: {
    visible: true,
  },
  [GeneralField.Year]: {
    visible: true,
  },
  [GeneralField.Currency]: {
    visible: true,
  },
  [GeneralField.ReferenceNumber]: {
    visible: true,
  },
  [GeneralField.CustomFeatures]: {
    visible: true,
  },
  [GeneralField.SerialNumber]: {
    visible: true,
  },
};
