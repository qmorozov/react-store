import { DtoValidator } from '../../../app/validation/dto-validator';
import { Validator } from '../../../app/validation/validator';
import { KeyChainDto } from './key-chain.dto';
import { GeneralField } from '../ProductType.enum';

export const KeyChainDtoValidator = new DtoValidator<KeyChainDto>({
  size: [Validator.required(), Validator.isNumber(), Validator.min(1, 'error.min'), Validator.max(30, 'error.max')],
  shape: [Validator.required()],
  material: [Validator.required()],
  color: [Validator.required()],
  gemstones: [],
  engraving: [],
  packing: [Validator.required()],
});

export const RewritesKeyChainValidation: Record<GeneralField, { visible: boolean; validation?: any[] }> = {
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
