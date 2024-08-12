import { useForm } from 'react-hook-form';
import type { DtoValidator } from './dto-validator';
import { DropFirst } from '../client/helper.client';

export function useFormValidation<D>(validator: DtoValidator<D>, ...parameters: Parameters<typeof useForm>) {
  const form = useForm(...parameters);
  return {
    ...form,
    register: <T extends keyof D>(field: T, ...register: DropFirst<Parameters<(typeof form)['register']>>) => {
      const options = register[0] || {};
      const isRequired = !!validator.fields[field].find((v) => v?.id === 'required');
      options.validate = {
        ...(validator.fields[field] || []).reduce((acc, v) => {
          acc[v.id] = (value: any) => (v.isValid(value, isRequired) ? undefined : v.message);
          return acc;
        }, {}),
        ...(options.validate || {}),
      };
      register[0] = options;
      return form.register(field as string, ...register);
    },
    errors(field: keyof D) {
      return form.formState.errors[field as string];
    },
    handleSubmit(
      onValid: Parameters<(typeof form)['handleSubmit']>[0],
      onError?: Parameters<(typeof form)['handleSubmit']>[1],
      ...parameters: DropFirst<Parameters<(typeof form)['handleSubmit']>>
    ) {
      return form.handleSubmit((data, ...eventInfo) => {
        const errors = validator.hasErrors(data);
        if (!errors) {
          return onValid(data, ...eventInfo);
        }
        return onError?.(errors as any, ...eventInfo);
      }, ...parameters);
    },
  };
}
