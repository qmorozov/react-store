import { DtoValidator } from '../../../app/validation/dto-validator';
import { Validator } from '../../../app/validation/validator';
import { GeneralField } from '../ProductType.enum';
import { PinsBroochesDto } from './pinsBrooches.dto';

export const PinsBroochesDtoValidator = new DtoValidator<PinsBroochesDto>({
  size: [Validator.required(), Validator.isNumber(), Validator.min(1, 'error.min'), Validator.max(30, 'error.max')],
  type: [Validator.required()],
  gemstoneType: [],
  packing: [Validator.required()],
  material: [Validator.required()],
});

export const RewritesPinsBroochesValidation: Record<GeneralField, { visible: boolean; validation?: any[] }> = {
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
