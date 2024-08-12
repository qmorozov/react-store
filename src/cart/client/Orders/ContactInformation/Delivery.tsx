import { FC, useEffect } from 'react';
import { useTranslations } from '../../../../translation/translation.context';
import FormControl from '../../../../layouts/shared/FormControl';
import Select, { ISelectOption } from '../../../../layouts/shared/Select';
import { IDeliveryFields, IShipping } from '../../checkout.client';

interface IDelivery {
  register: any;
  errors: any;
  setValue: any;
  shipping: IShipping[];
  delivery: IDeliveryFields;
  setShippingService: (shippingService) => void;
}

enum Field {
  Apartment = 'apartment',
  City = 'city',
  Country = 'country',
  DeliveryPoint = 'deliveryPoint',
  House = 'house',
  PointIssue = 'pointOfIssue',
  Street = 'street',
  ZipCode = 'zip',
  Provider = 'provider',
}

const Delivery: FC<IDelivery> = ({ setShippingService, register, errors, shipping, delivery, setValue }) => {
  const tr = useTranslations();

  useEffect(() => {
    setValue(Field.Provider, shipping[0].provider);
  }, []);

  return (
    <div className="delivery">
      <h3>{tr.get('checkout.delivery')}</h3>
      <fieldset>
        <Select
          placeholder={tr.get('checkout.deliveryService')}
          options={shipping.map(({ provider, name }) => ({
            id: provider,
            value: provider,
            label: name,
          }))}
          defaultValue={shipping[0].provider}
          onChange={(shippingItem: ISelectOption) => {
            setShippingService(shippingItem);
            setValue(Field.Provider, shippingItem.id);
          }}
          defaultText={tr.get('common.select')}
        />

        <FormControl placeholder={tr.get('checkout.apartment')} error={errors(Field.Apartment)}>
          <input {...register(Field.Apartment)} defaultValue={delivery.apartment} />
        </FormControl>

        <FormControl placeholder={tr.get('checkout.city')} error={errors(Field.City)}>
          <input {...register(Field.City)} defaultValue={delivery.city} />
        </FormControl>

        <FormControl placeholder={tr.get('checkout.country')} error={errors(Field.Country)}>
          <input {...register(Field.Country)} defaultValue={delivery.country} />
        </FormControl>

        <FormControl placeholder={tr.get('checkout.deliveryPoint')} error={errors(Field.DeliveryPoint)}>
          <input {...register(Field.DeliveryPoint)} defaultValue={delivery.deliveryPoint} />
        </FormControl>

        <FormControl placeholder={tr.get('checkout.house')} error={errors(Field.House)}>
          <input {...register(Field.House)} defaultValue={delivery.house} />
        </FormControl>

        <FormControl placeholder={tr.get('checkout.pointIssue')} error={errors(Field.PointIssue)}>
          <input {...register(Field.PointIssue)} defaultValue={delivery.pointOfIssue} />
        </FormControl>

        <FormControl placeholder={tr.get('checkout.street')} error={errors(Field.Street)}>
          <input {...register(Field.Street)} defaultValue={delivery.street} />
        </FormControl>

        <FormControl type="number" placeholder={tr.get('checkout.zipCode')} error={errors(Field.ZipCode)}>
          <input
            type="number"
            {...register(Field.ZipCode, {
              validate: (value) => value > 0,
            })}
            defaultValue={delivery.zip}
          />
        </FormControl>
      </fieldset>
    </div>
  );
};

export default Delivery;
