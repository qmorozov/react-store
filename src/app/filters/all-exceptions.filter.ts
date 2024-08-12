import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { AppRequest } from '../models/request';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest() as AppRequest;

    if (request.accepts('html') && (request.header('accept') || '').includes('text/html')) {
      const response = ctx.getResponse();

      if (exception instanceof NotFoundException) {
        return response.redirect('/404');
      }

      if (exception instanceof UnauthorizedException) {
        return response.redirect(`/auth`);
      }

      if (exception instanceof ForbiddenException) {
        return response.redirect(`/auth?redirect=${request.url}`);
      }
    }

    return super.catch(exception, host);
  }
}
