export type IValidator = {
  id: string;
  message: string;
  param: any;
  isValid: (value, isRequired?: boolean) => boolean;
};

export const RequiredValidator = 'required';

export function makeValidator<T = any>(
  id: IValidator['id'],
  message: IValidator['message'],
  checkIsValid: (value: T) => boolean,
  param?: any,
): IValidator {
  return {
    id,
    message,
    param,
    isValid: (value, isRequired = false) => {
      return !value && !isRequired ? true : checkIsValid(value);
    },
  };
}

export abstract class Validate {
  static required(value: any) {
    return !(value === undefined || value === null || value === '');
  }

  static email(email: string) {
    return !!email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  }

  static minLength<V extends string | any[]>(length: number, value: V) {
    return value?.length >= length;
  }

  static maxLength<V extends string | any[]>(length: number, value: V) {
    return value?.length <= length;
  }

  static isNumber(value: any) {
    return !isNaN(value);
  }

  static min(min: number, value: number) {
    return value >= min;
  }

  static max(max: number, value: number) {
    return value <= max;
  }

  static isEnum<T>(enumType: T, value: any) {
    return Object.values(enumType).includes(value);
  }

  static checkbox(value: boolean) {
    return value === true;
  }
}

export abstract class Validator {
  static required(message = 'error.required'): IValidator {
    return makeValidator(RequiredValidator, message, (value) => Validate.required(value));
  }

  static isNumber(message = 'error.isNumber'): IValidator {
    return makeValidator('isNumber', message, (value) => Validate.isNumber(value));
  }

  static min(min: number, message = 'error.min'): IValidator {
    return makeValidator('min', message, (value) => Validate.min(min, value), min);
  }

  static max(max: number, message = 'error.max'): IValidator {
    return makeValidator('max', message, (value) => Validate.max(max, value), max);
  }

  static isEnum<T>(enumType: T, message = 'error.isEnum'): IValidator {
    return makeValidator('isEnum', message, (value) => Validate.isEnum(enumType, value), enumType);
  }

  static email(message = 'error.email'): IValidator {
    return makeValidator<string>('email', message, (value) => Validate.email(value));
  }

  static minLength(length: number, message = 'error.minLength'): IValidator {
    return makeValidator<string | any[]>('minLength', message, (value) => Validate.minLength(length, value), length);
  }

  static maxLength(length: number, message = 'error.maxLength'): IValidator {
    return makeValidator('maxLength', message, (value) => Validate.maxLength(length, value), length);
  }

  static checkbox(message = 'error.checkbox'): IValidator {
    return makeValidator('checkbox', message, (value) => Validate.checkbox(value));
  }
}
