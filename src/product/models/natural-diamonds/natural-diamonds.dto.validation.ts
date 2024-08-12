import { DtoValidator } from '../../../app/validation/dto-validator';
import { Validator } from '../../../app/validation/validator';
import { NaturalDiamondsDto } from './natural-diamonds.dto';
import { GeneralField } from '../ProductType.enum';

export const NaturalDiamondsDtoValidator = new DtoValidator<NaturalDiamondsDto>({
  carat: [
    Validator.required(),
    Validator.min(0.3, 'error.min'),
    Validator.max(3000, 'error.max'),
    Validator.isNumber(),
  ],
  clarity: [Validator.required()],
  colorGrade: [Validator.required()],
  cut: [Validator.required()],
  shape: [Validator.required()],
  cutScore: [Validator.required(), Validator.min(5, 'error.min'), Validator.max(10, 'error.max'), Validator.isNumber()],
  depth: [Validator.required(), Validator.min(0, 'error.min'), Validator.max(100, 'error.max'), Validator.isNumber()],
  fluorescence: [Validator.required()],
  lwRatio: [Validator.required(), Validator.min(0, 'error.min'), Validator.max(3, 'error.max'), Validator.isNumber()],
  table: [Validator.required(), Validator.min(0, 'error.min'), Validator.max(100, 'error.max'), Validator.isNumber()],
});

export const RewritesNaturalDiamondsValidation: Record<GeneralField, { visible: boolean; validation?: any[] }> = {
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
    validation: [Validator.required()],
  },
  [GeneralField.CustomFeatures]: {
    visible: false,
    validation: [],
  },
  [GeneralField.SerialNumber]: {
    visible: false,
    validation: [],
  },
};
