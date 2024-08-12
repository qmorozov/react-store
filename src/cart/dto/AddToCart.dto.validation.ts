import { DtoValidator } from '../../app/validation/dto-validator';
import { AddToCartDto } from './AddToCart.dto';
import { Validator } from '../../app/validation/validator';
import { Currency } from '../../payment/model/currency.enum';

export const AddToCartDtoValidator = new DtoValidator<AddToCartDto>({
  quantity: [Validator.isNumber()],
  price: [Validator.isNumber()],
  currency: [Validator.isEnum(Currency)],
});
