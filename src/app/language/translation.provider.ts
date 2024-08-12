import LanguageConfig from '../../translation/config.json';

interface ILanguageOptions {
  status?: boolean;
}

type ILanguageConfig = Record<string, ILanguageOptions>;

export type LanguageCode = 'en';

type ParsedUrl = {
  languageInUrl: boolean;
  language: LanguageCode;
  clearUrl: string;
};

export abstract class TranslationProvider {
  get(key: string, parameters?: Record<string, any>): string {
    const value = this.dictionary?.[key] || key;
    return value && parameters ? value.replace(/{{(.+?)}}/gm, (match, p1) => parameters?.[p1?.trim()] || match) : value;
  }

  abstract readonly language: LanguageCode;
  protected abstract readonly url: string;

  link(link: string | number | (string | number)[], language: LanguageCode = this.language): string {
    return TranslationProvider.link(link, language);
  }

  static link(link: string | number | (string | number)[], language: LanguageCode): string {
    link = Array.isArray(link) ? link.join('/') : String(link);
    return `${TranslationProvider.languagePrefix(language)}${link}`;
  }

  languageLink(language: LanguageCode | string, link: Parameters<this['link']>[0] = this.url): string {
    return this.link(link, language as LanguageCode);
  }

  protected static languagePrefix(language: LanguageCode) {
    return language === TranslationProvider.default ? '' : `/${language}`;
  }

  static readonly available: ILanguageConfig = Object.entries(LanguageConfig || ({} as ILanguageConfig)).reduce(
    (acc, [key, value]) => {
      if (!Object.hasOwnProperty.call(value, 'status') || (value as ILanguageOptions).status) {
        acc[key] = value;
      }
      return acc;
    },
    {} as ILanguageConfig,
  );

  public get available() {
    return TranslationProvider.available;
  }

  static availableLanguages(): LanguageCode[] {
    return Object.keys(this.available) as LanguageCode[];
  }

  static schemaProperty() {}

  availableLanguages(): LanguageCode[] {
    return TranslationProvider.availableLanguages();
  }

  public static default: LanguageCode = 'en';

  protected constructor(private readonly dictionary: Record<string, string>) {}

  static has(code: string): boolean {
    return !!this.available[code];
  }

  static parseUrl(url: string): ParsedUrl {
    const urlParts = (url || '/').split('/').filter(Boolean);
    const language = urlParts.shift();
    const languageInUrl = language && TranslationProvider.has(language);

    return {
      languageInUrl,
      language: TranslationProvider.validate(language),
      clearUrl: languageInUrl ? '/' + urlParts.join('/') : url,
    };
  }

  static validate(language: string): LanguageCode {
    return (
      language && TranslationProvider.has(language as LanguageCode) ? language : TranslationProvider.default
    ) as LanguageCode;
  }

  static $flatten(obj: Record<string, any>, prefix = ''): Record<string, string> {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object') Object.assign(acc, this.$flatten(obj[k], pre + k));
      else acc[pre + k] = obj[k];
      return acc;
    }, {});
  }

  static async process(loading: Promise<Record<string, any>[]>) {
    return loading
      .then((translations) => Object.assign({}, ...translations))
      .then((translations) => this.$flatten(translations));
  }
}
