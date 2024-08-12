import { IValidator, RequiredValidator, Validate } from './validator';

export type DTO = Record<string, any>;

export type DTOField<R extends boolean = boolean> = IValidator[];

export type DtoValidation<D extends DTO> = Required<{
  readonly [key in keyof D]: DTOField;
}>;

export type DtoErrorInfo =
  | true
  | {
      message?: string;
      param?: Record<string, any>;
    };

export type DtoError = {
  [key: string]: DtoErrorInfo;
};

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...a: any[]) => any ? never : K;
}[keyof T];

export type iModelDto<A, E extends keyof A = never, ADD extends string = never> = Omit<
  Pick<A, NonFunctionPropertyNames<A>>,
  'id' | 'product' | E
> & { [K in ADD]: any };

export type ModelDto<Of> = abstract new () => iModelDto<Of>;

export function makeDtoError(id: string, info: DtoErrorInfo = true): DtoError {
  return { [id]: info };
}

export function makeDtoErrorForValidator(validator: IValidator): DtoError {
  const info: DtoErrorInfo = {};

  if (validator.message) {
    info.message = validator.message;
  }

  if (validator.param) {
    info.param = validator.param;
  }

  return makeDtoError(validator.id, info);
}

export class DtoValidator<D extends Record<string, any> = any> {
  public readonly param: Record<keyof D, any>;

  constructor(public readonly fields: DtoValidation<D>) {
    this.param = Object.entries(this.fields).reduce((params, [key, value]) => {
      params[key as keyof D] = ((value || []) as DTOField).reduce((fp, c) => {
        if (c.param !== undefined) {
          fp[c.id] = c.param;
        }
        return fp;
      }, {});
      return params;
    }, {} as Record<keyof D, any>);
  }

  errors<D extends DTO>(dto: D) {
    return Object.keys(this.fields).reduce((errors, key) => {
      const rules: DTOField = this.fields[key];
      const value = dto?.[key];
      const isRequired = rules.find((validator) => validator.id === RequiredValidator);
      if (isRequired && !Validate.required(value)) {
        errors[key as keyof D] = makeDtoErrorForValidator(isRequired);
      } else if (Validate.required(value) && rules) {
        const fieldError = rules.find((validator) => !validator.isValid(value));
        if (fieldError) {
          errors[key as keyof D] = makeDtoErrorForValidator(fieldError);
        }
      }

      return errors;
    }, {} as Partial<Record<keyof D, DtoError>>);
  }

  hasErrors<D extends DTO>(dto: D): null | Partial<Record<keyof D, DtoError>> {
    const errors = this.errors(dto);
    return Object.keys(errors).length ? errors : null;
  }
}
