import { RenderClientPage } from '../../app/client/render-client-page';
import { Translations } from '../../translation/translation.provider.client';
import { TranslationContext } from '../../translation/translation.context';
import Tabs, { Tab } from '../../layouts/shared/Tabs';
import Breadcrumbs from '../../layouts/shared/Breadcrumbs';
import LogIn from './tabs/login-tab.client';
import Registration from './tabs/register-tab.client';
import ForgotPassword from './tabs/forgot-tab.client';

import './style/auth.client.scss';

export enum AuthTabs {
  Login = 'login',
  Register = 'register',
  Forgot = 'forgot',
}

(async () => {
  const translation = await Translations.load('auth', 'common', 'error');

  return RenderClientPage(() => {
    const breadcrumbs = [{ title: translation.get('auth.title') }];

    const authTabs: Tab[] = [
      {
        id: AuthTabs.Login,
        title: translation.get('auth.login.title'),
        content: <LogIn />,
      },
      {
        id: AuthTabs.Register,
        title: translation.get('auth.register.title'),
        content: <Registration />,
      },
      {
        id: AuthTabs.Forgot,
        title: translation.get('auth.forgot.title'),
        content: <ForgotPassword />,
      },
    ];

    return (
      <TranslationContext.Provider value={translation}>
        <Breadcrumbs crumbs={breadcrumbs} />
        <section className="auth-container">
          <h1 className="auth__title">{translation.get('auth.title')}</h1>
          <div className="auth__tabs-container --small">
            <Tabs options={authTabs} selectedTabId={authTabs[0].id} />
          </div>
        </section>
      </TranslationContext.Provider>
    );
  });
})();
