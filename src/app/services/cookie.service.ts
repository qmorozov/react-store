import { CookieOptions } from 'express-serve-static-core';
import { Response } from 'express';
import { AppRequest } from '../models/request';

export abstract class CookieService {
  public static readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    signed: true,
    secure: true,
    sameSite: true,
  };

  static send(response: Response, name: string, value: string, options?: CookieOptions) {
    return response.cookie(name, value, {
      ...CookieService.cookieOptions,
      ...(options || {}),
    });
  }

  static get(request: AppRequest, name: string) {
    return request.signedCookies[name];
  }

  static clear(response: Response, name: string, options?: CookieOptions) {
    return response.clearCookie(name, {
      ...CookieService.cookieOptions,
      ...(options || {}),
    });
  }
}
