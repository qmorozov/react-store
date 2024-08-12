import { DtoValidator } from '../../../app/validation/dto-validator';
import { Validator } from '../../../app/validation/validator';
import { TieClipDto } from './tie-clip.dto';
import { GeneralField } from '../ProductType.enum';

export const TieClipDtoValidator = new DtoValidator<TieClipDto>({
  size: [Validator.required()],
  material: [Validator.required()],
  type: [Validator.required()],
  color: [Validator.required()],
  style: [Validator.required()],
  incut: [Validator.required()],
  gemstoneType: [],
  engraving: [],
  packing: [Validator.required()],
});

export const RewritesTieClipValidation: Record<GeneralField, { visible: boolean; validation?: any[] }> = {
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
