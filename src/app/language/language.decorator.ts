import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppRequest, AppResponse } from '../models/request';

export const Lang = createParamDecorator((data: void, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as AppRequest;
  return request.language;
});

export const Translation = createParamDecorator((data: void, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as AppRequest;
  return request.translation;
});

export const Redirect = createParamDecorator((data: void, ctx: ExecutionContext) => {
  const response = ctx.switchToHttp().getResponse() as AppResponse;
  return response.redirectTo;
});
