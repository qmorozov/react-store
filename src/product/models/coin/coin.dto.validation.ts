import { DtoValidator } from '../../../app/validation/dto-validator';
import { Validator } from '../../../app/validation/validator';
import { CoinDto } from './coin.dto';
import { GeneralField } from '../ProductType.enum';

export const CoinDtoValidator = new DtoValidator<CoinDto>({
  material: [Validator.required()],
  peculiarities: [Validator.required()],
  theme: [Validator.required()],
  circulation: [Validator.required()],
  par: [Validator.required()],
  origin: [Validator.required()],
  state: [Validator.required()],
  denomination: [Validator.required()],
  collection: [],
  certificate: [Validator.required()],
  stateReward: [],
  comesWithPacking: [],
  size: [Validator.required()],
  packingMaterial: [Validator.required()],
  packingSize: [Validator.required()],
});

export const RewritesCoinValidation: Record<GeneralField, { visible: boolean; validation?: any[] }> = {
  [GeneralField.Sex]: {
    visible: false,
    validation: [],
  },
  [GeneralField.CanSuggestPrice]: {
    visible: true,
  },
  [GeneralField.BrandId]: {
    visible: true,
  },
  [GeneralField.Model]: {
    visible: false,
    validation: [],
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
    visible: false,
    validation: [],
  },
  [GeneralField.SerialNumber]: {
    visible: true,
  },
};
