import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DtoErrorInfo, DtoValidator, makeDtoError } from './dto-validator';
import { AppResponse } from '../services/response';

export function sendDtoError(errors) {
  return AppResponse.throwBadRequest(errors);
}

export function sendValidationError(field: string, message?: string | DtoErrorInfo): void {
  const info: DtoErrorInfo = typeof message === 'string' ? { message } : message;
  return sendDtoError(makeDtoError(field, info));
}

export function sendFormError(code: string, message?: string | DtoErrorInfo): void {
  return sendDtoError({ code, message });
}

export function validateDto(dtoValidator: DtoValidator, data: any) {
  const errors = dtoValidator?.hasErrors(data);

  if (errors) {
    return sendDtoError(errors);
  }

  const fields = Object.keys(dtoValidator?.fields || {});
  return fields?.length
    ? fields.reduce((dto, key) => {
        dto[key] = data?.[key];
        return dto;
      }, {})
    : data;
}

export function onlyFilledFields(data: any, removeEmptyStrings = false) {
  return Object.keys(data || {}).reduce((dto, key) => {
    if (
      data[key] !== undefined &&
      data[key] !== null &&
      (typeof data[key] === 'string' ? !removeEmptyStrings || data[key]?.length : true)
    ) {
      dto[key] = data[key];
    }
    return dto;
  }, {});
}

export const DTO = (dtoValidator: DtoValidator) =>
  createParamDecorator<DtoValidator>((dtoValidator: DtoValidator | undefined, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest();
    return validateDto(dtoValidator, request.body);
  })(dtoValidator);
