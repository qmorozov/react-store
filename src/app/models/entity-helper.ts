import { LanguageCode } from '../language/translation.provider';
import { getTranslatedFields } from '../database/database.decorators';
import { TranslationProviderServer } from '../../translation/translation.provider.server';
import { replaceCharMap } from './slug';

export abstract class Model {
  protected static fillable?: string[];

  protected static public?: string[];

  static strBool(str: string | any) {
    return typeof str === 'string' ? str === 'true' || str === '1' : !!str;
  }

  static fromJson<T extends Model>(
    this: new (...args: any[]) => T,
    json: Partial<{
      [P in keyof T]: T[P];
    }>,
  ): T {
    return new this().fromJson(json);
  }

  fromJson(
    json: Partial<{
      [P in keyof this]: this[P];
    }>,
  ): this {
    return Object.entries(json).reduce((acc, [key, value]) => {
      const cls = this.constructor as unknown as typeof Model;
      if (key && cls.fillable?.includes(key)) {
        acc[key] = value;
      }
      return acc;
    }, this);
  }

  static slug(str: string) {
    return Object.entries(replaceCharMap)
      .reduce((s, [k, v]) => {
        return s.replace(RegExp(k, 'g'), v);
      }, str.toString().normalize('NFD'))
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/&/g, '-and-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  toJson(): Record<string, any> {
    return ((this.constructor as typeof Model).public || []).reduce((acc, key) => {
      acc[key] = this[key];
      return acc;
    }, {}) as Record<string, any>;
  }

  toFullJson() {
    return ((this.constructor as typeof Model).public || []).reduce((acc, key) => {
      if (!acc[key] && this[key]) {
        acc[key] = this[key];
      }
      return acc;
    }, Object.fromEntries(Object.entries(this)));
  }

  public static select(rewrite: Record<string, boolean>) {
    return Object.assign(
      this.public.reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {}),
      rewrite || {},
    );
  }

  public static langCol(name: string) {
    return TranslationProviderServer.availableLanguages().map((lang) => this.withLang(name, lang));
  }

  public static langSchemaProperty(name: string, schema?: any) {
    return TranslationProviderServer.availableLanguages().reduce((a, lang) => {
      a[this.withLang(name, lang)] = schema || {
        type: 'string',
      };
      return a;
    }, {});
  }

  public static withLang(name: string, lang = TranslationProviderServer.default) {
    return `${name}_${lang}`;
  }

  setLanguage(language: LanguageCode): this {
    Object.entries(getTranslatedFields(this)).forEach(([key, value]) => {
      this[key] = this[value[language]];
    });
    return this;
  }
}
