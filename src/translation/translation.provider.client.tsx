import { LanguageCode, TranslationProvider } from '../app/language/translation.provider';

export class Translations extends TranslationProvider {
  private static readonly language = this.validate(document?.documentElement?.getAttribute?.('lang'));

  public readonly language: LanguageCode;
  protected readonly url: string;

  static link(link: string | number | (string | number)[]): string {
    return TranslationProvider.link(link, Translations.language);
  }

  constructor(translations: TranslationProvider['dictionary']) {
    super(translations);
    this.language = Translations.language;
    this.url = TranslationProvider.parseUrl(window?.location?.pathname || '/')?.clearUrl;
  }

  public static async load(...translations: string[]): Promise<Translations> {
    return new Translations(
      await this.process(
        Promise.all(
          translations.map((file) => {
            return import(`./${Translations.language}/${file}.json`).then((module) => ({ [file]: module.default }));
          }),
        ),
      ),
    );
  }
}
