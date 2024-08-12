import { DtoValidator } from '../../../app/validation/dto-validator';
import { Validator } from '../../../app/validation/validator';
import { PensDto } from './pens.dto';
import { GeneralField } from '../ProductType.enum';

export const PensDtoValidator = new DtoValidator<PensDto>({
  size: [Validator.required(), Validator.isNumber(), Validator.min(1, 'error.min'), Validator.max(30, 'error.max')],
  bodyColor: [Validator.required()],
  bodyMaterial: [Validator.required()],
  combined_materials: [],
  inkColor: [Validator.required()],
  inkReplaceable: [],
  engraving: [],
  vintage: [],
  rare: [],
  awardCommemorative: [],
  comesWithPacking: [],
  originalCase: [],
  tags: [],
  type: [Validator.required()],
});

export const RewritesPensValidation: Record<GeneralField, { visible: boolean; validation?: any[] }> = {
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
