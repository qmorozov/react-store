import { Request, Response } from 'express';
import { CurrentUser } from '../../auth/models/CurrentUser';
import { LanguageCode } from '../language/translation.provider';
import { TranslationProviderServer } from '../../translation/translation.provider.server';
import { OwnerInfo } from '../../product/models/OwnerInfo';

export interface AppRequest extends Request {
  user: CurrentUser | null | undefined;

  shop?: OwnerInfo | null;

  language: LanguageCode;

  translation: TranslationProviderServer;

  timeLabel?(label: string): void;
}

export interface AppResponse extends Response {
  redirectTo: (url: string, status?: number) => void;

  timeLabel?(label: string): void;
}

export type AppRedirect = AppResponse['redirectTo'];
