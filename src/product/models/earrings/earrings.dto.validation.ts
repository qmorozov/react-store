import { DtoValidator } from '../../../app/validation/dto-validator';
import { Validator } from '../../../app/validation/validator';
import { GeneralField } from '../ProductType.enum';
import { EarringsDto } from './earrings.dto';

export const EarringsDtoValidator = new DtoValidator<EarringsDto>({
  size: [Validator.required(), Validator.isNumber(), Validator.min(1, 'error.min'), Validator.max(30, 'error.max')],
  type: [Validator.required()],
  material: [Validator.required()],
  color: [Validator.required()],
  gem: [Validator.required()],
  vintage: [],
  proofOfOrigin: [],
  originalCase: [],
  cardOrCertificate: [],
});

export const RewritesEarringsValidation: Record<GeneralField, { visible: boolean; validation?: any[] }> = {
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
    visible: false,
    validation: [],
  },
  [GeneralField.SerialNumber]: {
    visible: true,
    validation: [],
  },
};
