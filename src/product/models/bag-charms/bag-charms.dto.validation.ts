import { DtoValidator } from '../../../app/validation/dto-validator';
import { Validator } from '../../../app/validation/validator';
import { BagCharmsDto } from './bag-charms.dto';
import { GeneralField } from '../ProductType.enum';

export const BagCharmsDtoValidator = new DtoValidator<BagCharmsDto>({
  size: [Validator.required(), Validator.isNumber(), Validator.min(1, 'error.min'), Validator.max(30, 'error.max')],
  material: [Validator.required()],
  combined_materials: [],
  color: [Validator.required()],
  gemstones: [],
  art: [Validator.required()],
  packing: [Validator.required()],
});

export const RewritesBagCharmsValidation: Record<GeneralField, { visible: boolean; validation?: any[] }> = {
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
