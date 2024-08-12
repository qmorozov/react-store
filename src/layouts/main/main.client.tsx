import { RenderClientPage } from '../../app/client/render-client-page';
import { Translations } from '../../translation/translation.provider.client';
import { AccountServiceClient } from '../../user/client/account.service.client';
import UserDropdown from './components/UserDropdown';
import { TranslationContext } from '../../translation/translation.context';
import { initRedirectSelect } from '../../app/client/helper.client';
import './components/Search';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://0144cc16dacc9c709e30bda2a784db1d@o4505947398864896.ingest.sentry.io/4505947402797056',
});

initRedirectSelect();

const headerDropdownButtons: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.header-menu__dropdown-btn');
const headerBurgerMenu: HTMLElement | null = document.querySelector('#header-burger-menu');
const headerMenu: HTMLElement | null = document.querySelector('.header__navigation-container');

const closeAllDropdowns = (): void => {
  headerDropdownButtons.forEach((button: HTMLButtonElement) => {
    const nextElement = button.nextElementSibling as HTMLElement;
    nextElement.classList.remove('--active');
    button.classList.remove('--active');
  });
};

const toggleHeaderMenu = (): void => {
  if (headerMenu && headerBurgerMenu) {
    headerMenu.classList.toggle('--active');
    headerBurgerMenu.classList.toggle('--active');
    document.querySelector('body')!.style.overflowY = headerMenu.classList.contains('--active') ? 'hidden' : 'auto';
  }
};

const handleButtonClick = (event: MouseEvent): void => {
  const nextElement = (event.currentTarget as HTMLElement).nextElementSibling as HTMLElement;
  const isActive = nextElement.classList.contains('--active');

  closeAllDropdowns();

  if (!isActive) {
    nextElement.classList.add('--active');
    (event.currentTarget as HTMLElement).classList.add('--active');
  }

  event.stopPropagation();
};

const handleDocumentKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    closeAllDropdowns();
  }
};

const handleDocumentClick = (): void => {
  closeAllDropdowns();
};

headerDropdownButtons.forEach((button: HTMLButtonElement) => {
  button.addEventListener('click', handleButtonClick);
});

document.addEventListener('keydown', handleDocumentKeyDown);
document.addEventListener('click', handleDocumentClick);
if (headerBurgerMenu) {
  headerBurgerMenu.addEventListener('click', toggleHeaderMenu);
}

(async (userDropdownElementId) => {
  const translation = await Translations.load('header', 'common', 'error');
  const list = AccountServiceClient.list();
  const currentUser = AccountServiceClient.get();

  return RenderClientPage(() => {
    const onChangeUUID = (uuid: string) => {
      if (AccountServiceClient.set(uuid)) {
        window.location.reload();
      }
    };

    return (
      <TranslationContext.Provider value={translation}>
        <UserDropdown userList={list} currentUser={currentUser} onChangeUUID={onChangeUUID} />
      </TranslationContext.Provider>
    );
  }, userDropdownElementId);
})('user-dropdown');
