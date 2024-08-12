import 'reflect-metadata';
import { LanguageCode } from '../language/translation.provider';

const translateFieldsId = Symbol('translate@fields');

export function ColumnFromTranslations<T>(fields: Record<LanguageCode, keyof T>) {
  return (target: T, propertyKey: string | symbol) => {
    const translatedFields = Reflect.getMetadata(translateFieldsId, target) || {};
    translatedFields[propertyKey] = fields;
    return Reflect.defineMetadata(translateFieldsId, translatedFields, target);
  };
}

export function getTranslatedFields<T>(target: T): Record<LanguageCode, keyof T> {
  return Reflect.getMetadata(translateFieldsId, target) || {};
}
