import { TranslationProviderServer } from '../../translation/translation.provider.server';

export const blogCategoryDto = {
  schema: {
    type: 'object',
    required: TranslationProviderServer.availableLanguages().map((l) => `name_${l}`),
    properties: TranslationProviderServer.availableLanguages().reduce((d, c) => {
      d[`name_${c}`] = {
        type: 'string',
        nullable: false,
        description: 'Add for each language. Example: name_en',
      };
      return d;
    }, {}),
  },
};
