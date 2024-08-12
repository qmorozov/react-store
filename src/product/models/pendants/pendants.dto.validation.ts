import { DtoValidator } from '../../../app/validation/dto-validator';
import { Validator } from '../../../app/validation/validator';
import { GeneralField } from '../ProductType.enum';
import { PendantsDto } from './pendants.dto';

export const PendantsDtoValidator = new DtoValidator<PendantsDto>({
  size: [Validator.required()],
  type: [Validator.required()],
  coating: [Validator.required()],
  material: [Validator.required()],
  color: [Validator.required()],
  gemstonesQuantity: [Validator.required()],
  gemstones: [Validator.required()],
  mixedStones: [],
  largeStones: [],
  gemstoneColor: [Validator.required()],
  incut: [],
  incutColor: [Validator.required()],
  packing: [Validator.required()],
});

export const RewritesPendantsValidation: Record<GeneralField, { visible: boolean; validation?: any[] }> = {
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
