import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { AppMiddleware } from '../services/app-middleware';
import { AppRequest, AppResponse } from '../models/request';
import { TranslationProviderServer } from '../../translation/translation.provider.server';

@Injectable()
export class LanguageMiddleware extends AppMiddleware implements NestMiddleware {
  async use(req: AppRequest, res: AppResponse, next: NextFunction): Promise<ReturnType<NextFunction>> {
    if (this.canUse(req)) {
      const parsed = TranslationProviderServer.parseUrl(req.url || '/');
      req.translation = await TranslationProviderServer.load(
        TranslationProviderServer.validate(parsed.language),
        parsed.clearUrl || '/',
      );
      req.language = req.translation.language;
      if (parsed.languageInUrl) {
        req.url = parsed.clearUrl;
      }

      res.redirectTo = (url: string, status?: number) => {
        const redirect = status ? res.status(status) : res;
        return redirect.redirect(req.translation.link(url));
      };
    }
    return next();
  }
}
