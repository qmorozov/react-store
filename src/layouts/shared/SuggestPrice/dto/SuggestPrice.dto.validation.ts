import { DtoValidator } from '../../../../app/validation/dto-validator';
import { Validator } from '../../../../app/validation/validator';
import { Currency } from '../../../../payment/model/currency.enum';

export const SuggestPriceDtoValidator = new DtoValidator<any>({
  price: [Validator.required(), Validator.min(1), Validator.max(100000000)],
});
