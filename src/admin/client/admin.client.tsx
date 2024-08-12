import { RenderClientPage } from '../../app/client/render-client-page';
import { BrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import AdminMain from './AdminMain';
import { Translations } from '../../translation/translation.provider.client';
import { TranslationContext } from '../../translation/translation.context';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

(async () => {
  const translation = await Translations.load('filter', 'common', 'error');

  return RenderClientPage(() => {
    return (
      <TranslationContext.Provider value={translation}>
        <HelmetProvider>
          <BrowserRouter>
            <Suspense>
              <ToastContainer />

              <AdminMain />
            </Suspense>
          </BrowserRouter>
        </HelmetProvider>{' '}
      </TranslationContext.Provider>
    );
  }, 'admin-root');
})();
