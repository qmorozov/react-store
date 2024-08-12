import { TranslationProviderServer } from '../../translation/translation.provider.server';
import { CurrentUser } from '../../auth/models/CurrentUser';
import { IAppDocumentParameters } from './document';

export interface AppInfo {
  url: string;

  translation: TranslationProviderServer;

  user: CurrentUser | null;

  document?: IAppDocumentParameters;

  cart?: {
    count: number;
  };
}
