import { DtoValidator } from '../../../app/validation/dto-validator';
import { Validator } from '../../../app/validation/validator';
import { BeltDto } from './belt.dto';
import { GeneralField } from '../ProductType.enum';

export const BeltDtoValidator = new DtoValidator<BeltDto>({
  belt_length: [Validator.required()],
  clasp: [Validator.required()],
  material: [Validator.required()],
  combined_materials: [],
  color: [Validator.required()],
  type: [Validator.required()],
});

export const RewritesBeltValidation: Record<GeneralField, { visible: boolean; validation?: any[] }> = {
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
    visible: false,
    validation: [],
  },
  [GeneralField.SerialNumber]: {
    visible: true,
  },
};
