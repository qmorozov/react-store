import { DtoValidator } from '../../../app/validation/dto-validator';
import { Validator } from '../../../app/validation/validator';
import { WatchDto } from './watch.dto';
import { GeneralField } from '../ProductType.enum';

export const WatchDtoValidator = new DtoValidator<WatchDto>({
  width: [Validator.required(), Validator.min(10, 'error.min'), Validator.max(90, 'error.max'), Validator.isNumber()],
  height: [Validator.required(), Validator.min(10, 'error.min'), Validator.max(90, 'error.max'), Validator.isNumber()],
  body_material: [Validator.required()],
  combined_materials: [],
  body_shape: [Validator.required()],
  color_of_body: [Validator.required()],
  coating: [Validator.required()],
  type_of_indication: [Validator.required()],
  dial_color: [Validator.required()],
  glass: [Validator.required()],
  mechanism_type: [Validator.required()],
  water_protection: [Validator.required()],
  version: [Validator.required()],
  material: [Validator.required()],
  bracelet_or_strap: [Validator.required()],
});

export const RewritesWatchValidation: Record<GeneralField, { visible: boolean; validation?: any[] }> = {
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
