import { FC, useContext, useState } from 'react';
import { Currency } from 'src/payment/model/currency.enum';
import { useTranslations } from '../../../../translation/translation.context';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import { IContact, IDeliveryFields, IShipping } from '../../checkout.client';
import { CheckoutDtoValidator } from '../../../dto/checkout.dto.validator';
import ConfirmOrder from '../ConfirmOrder/ConfimOrder';
import Contacts from './Contacts';
import Delivery from './Delivery';
import { CheckoutApi } from '../../checkout.service.client';
import { OrderCreate } from '../orderCreateContext';

interface IContactInformation {
  cartLength: number;
  sellerId: string;
  sellerType: number;
  totalPrice: number;
  currency: Currency;
  shipping: IShipping[];
  contacts: IContact;
  delivery: IDeliveryFields;
}

const ContactInformation: FC<IContactInformation> = ({
  sellerId,
  sellerType,
  shipping,
  cartLength,
  totalPrice,
  currency,
  contacts,
  delivery,
}) => {
  const tr = useTranslations();
  const { register, handleSubmit, errors, setValue } = useFormValidation(CheckoutDtoValidator);
  const [shippingService, setShippingService] = useState(shipping[0]);
  const { setIsOrderSending } = useContext(OrderCreate);

  const handleCheckoutData = async (data: any) => {
    setIsOrderSending(true);
    try {
      const { id } = await CheckoutApi.postOrder(sellerId, sellerType, data);
      window.location.href = tr.link(`/cart/order/${id}`);
    } catch (error) {
      setIsOrderSending(false);
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit(handleCheckoutData)} noValidate autoComplete="off">
      <Delivery
        shipping={shipping}
        delivery={delivery}
        setShippingService={setShippingService}
        register={register}
        errors={errors}
        setValue={setValue}
      />
      <Contacts register={register} errors={errors} contacts={contacts} />
      <ConfirmOrder
        register={register}
        errors={errors}
        productCount={cartLength}
        totalPrice={totalPrice}
        currency={currency}
        shippingService={shippingService}
      />
    </form>
  );
};

export default ContactInformation;
