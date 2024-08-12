import { FC } from 'react';
import { Controller } from 'react-hook-form';
import Select, { ISelect, ISelectOption } from './index';
import { register } from 'tsconfig-paths';

interface IFormSelect extends ISelect {
  name: string;
  control: any;
  required?: boolean;
  register?: any;
  returnType?: 'id' | 'value' | 'label' | 'option' | undefined;
}

const FormSelect: FC<IFormSelect> = ({
  required = false,
  returnType = 'value',
  name,
  defaultText,
  options,
  placeholder,
  defaultValue,
  control,
  error,
  disabled,
}) => {
  return (
    <Controller
      name={name}
      shouldUnregister
      control={control}
      defaultValue={defaultValue}
      rules={{ required: required }}
      render={({ field: { onChange }, fieldState: { error: fieldError } }) => (
        <Select
          error={error || fieldError}
          options={options}
          onChange={(option: ISelectOption) => {
            if (returnType === 'id') {
              onChange(+option.id);
            } else if (returnType === 'value') {
              onChange(+option.value);
            } else if (returnType === 'label') {
              onChange(option.label);
            } else if (returnType === 'option') {
              onChange(option);
            } else {
              onChange(option);
            }
          }}
          disabled={disabled}
          placeholder={placeholder}
          defaultText={defaultText}
          defaultValue={defaultValue}
        />
      )}
    />
  );
};

export default FormSelect;
