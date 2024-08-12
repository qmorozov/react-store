import { DtoValidator } from '../../../app/validation/dto-validator';
import { Validator } from '../../../app/validation/validator';
import { WalletDto } from './wallet.dto';
import { GeneralField } from '../ProductType.enum';

export const WalletDtoValidator = new DtoValidator<WalletDto>({
  material: [Validator.required()],
  clasp: [Validator.required()],
  color: [Validator.required()],
  number_of_compartments_for_bills: [Validator.required()],
  number_of_compartments_for_cards: [Validator.required()],
});

export const RewritesWalletValidation: Record<GeneralField, { visible: boolean; validation?: any[] }> = {
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
