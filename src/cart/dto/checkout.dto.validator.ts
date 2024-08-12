import { DtoValidator } from '../../app/validation/dto-validator';
import { Validator } from '../../app/validation/validator';
import { OrderDeliveryInfo } from '../model/OrderDeliveryInfo';
import { OrderShippingInfo } from '../model/OrderShippingInfo';
import { OrderContactsInfo } from '../model/OrderContactsInfo';

export const OrderDeliveryInfoDtoValidation = new DtoValidator<OrderDeliveryInfo>({
  apartment: [Validator.required()],
  city: [Validator.required()],
  country: [Validator.required()],
  deliveryPoint: [Validator.required()],
  house: [Validator.required()],
  pointOfIssue: [Validator.required()],
  street: [Validator.required()],
  zip: [Validator.required(), Validator.isNumber()],
});

export const OrderShippingInfoDtoValidation = new DtoValidator<OrderShippingInfo>({
  provider: [Validator.required()],
});

export const OrderContactsInfoDtoValidation = new DtoValidator<OrderContactsInfo>({
  email: [Validator.required(), Validator.email()],
  firstName: [Validator.required(), Validator.minLength(3)],
  lastName: [Validator.required(), Validator.minLength(3)],
  phone: [Validator.required()],
  agree: [Validator.checkbox('Please accept the Data Processing Agreement.')],
});

export const CheckoutDtoValidator = new DtoValidator<OrderDeliveryInfo & OrderShippingInfo & OrderContactsInfo>({
  ...OrderDeliveryInfoDtoValidation.fields,
  ...OrderShippingInfoDtoValidation.fields,
  ...OrderContactsInfoDtoValidation.fields,
});
