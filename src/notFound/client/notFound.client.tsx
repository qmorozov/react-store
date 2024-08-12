import { Translations } from '../../translation/translation.provider.client';
import { RenderClientPage } from '../../app/client/render-client-page';
import { TranslationContext } from '../../translation/translation.context';
import Breadcrumbs from '../../layouts/shared/Breadcrumbs';

import './style/notFound.client.scss';

(async () => {
  const translation = await Translations.load('common', 'error');

  return RenderClientPage(() => {
    const breadcrumbs = [{ title: translation.get('common.PageNotFound') }];

    return (
      <TranslationContext.Provider value={translation}>
        <Breadcrumbs crumbs={breadcrumbs} />
        <section className="not-found-container --small">
          <h1>{translation.get('common.PageNotFound')}</h1>
        </section>
      </TranslationContext.Provider>
    );
  });
})();
