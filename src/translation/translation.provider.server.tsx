import { LanguageCode, TranslationProvider } from '../app/language/translation.provider';
import { join } from 'path';
import { readdirSync } from 'fs';

const translationFolder = join(__dirname, '..', '..', '..', 'src', 'translation');

const allTranslations = Object.keys(TranslationProvider.available || {}).reduce((acc, language) => {
  const translationFiles = readdirSync(join(translationFolder, language));
  acc[language] = TranslationProvider.process(
    Promise.all(
      translationFiles
        .filter((f) => f?.endsWith('.json'))
        .map((file) => {
          return import(join(translationFolder, language, file)).then((module) => ({
            [file.replace('.json', '')]: module.default,
          }));
        }),
    ),
  );
  return acc;
}, {});

export class TranslationProviderServer extends TranslationProvider {
  protected constructor(
    public readonly language: LanguageCode,
    public readonly url: string,
    translations: TranslationProvider['dictionary'],
  ) {
    super(translations);
  }

  public static async load(language: LanguageCode, url = '/'): Promise<TranslationProviderServer> {
    language = this.validate(language);
    return new TranslationProviderServer(
      language,
      TranslationProvider.parseUrl(url || '/').clearUrl,
      await allTranslations[language],
    );
  }
}
