import { FC } from 'react';
import { useTranslations } from '../../../../translation/translation.context';
import FormControl from '../../../../layouts/shared/FormControl';
import Select from '../../../../layouts/shared/Select';
import { IContact } from '../../checkout.client';

interface IContacts {
  register: any;
  errors: any;
  contacts: IContact;
}

enum Field {
  FirstName = 'firstName',
  LastName = 'lastName',
  Phone = 'phone',
  Email = 'email',
}

const Contacts: FC<IContacts> = ({ register, errors, contacts }) => {
  const tr = useTranslations();

  return (
    <div className="contacts">
      <h3>{tr.get('checkout.contacts')}</h3>

      <fieldset>
        <FormControl placeholder={tr.get('checkout.firstName')} error={errors(Field.FirstName)}>
          <input {...register(Field.FirstName)} defaultValue={contacts.firstName} />
        </FormControl>

        <FormControl placeholder={tr.get('checkout.lastName')} error={errors(Field.LastName)}>
          <input {...register(Field.LastName)} defaultValue={contacts.lastName} />
        </FormControl>

        <FormControl type="number" placeholder={tr.get('checkout.phone')} error={errors(Field.Phone)}>
          <input type="number" {...register(Field.Phone)} defaultValue={contacts.phone} />
        </FormControl>

        <FormControl placeholder={tr.get('checkout.email')} error={errors(Field.Email)}>
          <input {...register(Field.Email)} defaultValue={contacts.email} />
        </FormControl>
      </fieldset>
    </div>
  );
};

export default Contacts;
