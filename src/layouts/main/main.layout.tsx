import Header from './components/Header';
import Footer from './components/Footer';
import { AppInfo } from '../../app/models/app-info';
import { TranslationContext } from '../../translation/translation.context';
import { Category } from '../../product/models/category.entity';
import { className } from '../../app/client/helper.client';

const MainLayout = (appInfo: AppInfo, children: JSX.Element, categories: Category[]): JSX.Element => {
  const catalogLink = appInfo.translation.link('/catalog');

  const categoryMenu = [
    ...categories.map((category) => {
      const subCategories = category.subCategories;

      const menuItem: { label: string; route: string; subCategories?: Category[] } = {
        label: category.name || category.name_en,
        route: `${catalogLink}/${category.url}`,
      };

      if (subCategories && subCategories.length > 0) {
        menuItem.subCategories = subCategories;
      }

      return menuItem;
    }),
    {
      label: appInfo.translation.get('header.StartSelling'),
      route: appInfo.translation.link('/product/manage'),
    },
  ];

  const userMenu: { label: string; route: string; subCategories?: Category[] }[] = [
    {
      label: appInfo.translation.get('header.Feed'),
      route: appInfo.translation.link('/feed'),
    },
    {
      label: appInfo.translation.get('header.orders'),
      route: appInfo.translation.link('/cart/orders'),
    },
    {
      label: appInfo.translation.get('header.Shop'),
      route: appInfo.translation.link('/shop'),
    },
    {
      label: appInfo.translation.get('header.Pricing'),
      route: appInfo.translation.link('/pricing'),
    },
    {
      label: appInfo.translation.get('header.Reviews'),
      route: appInfo.translation.link('/reviews'),
    },
    {
      label: appInfo.translation.get('header.Profile'),
      route: appInfo.translation.link('/profile'),
    },
    {
      label: appInfo.translation.get('header.StartSelling'),
      route: appInfo.translation.link('/product/manage'),
    },
    {
      label: appInfo.translation.get('header.Logout'),
      route: appInfo.translation.link('/api/auth/logout'),
    },
  ];

  const clientUserInfo = ((info) => {
    const uInfoCopy = info ? { ...info } : null;
    if (uInfoCopy) {
      delete uInfoCopy.id;
    }
    return uInfoCopy;
  })(appInfo?.user || null);

  const headerMenu =
    clientUserInfo &&
    userMenu.find((item) => {
      return (appInfo?.url || '')?.startsWith(item.route);
    })
      ? userMenu
      : categoryMenu;

  const activeMenuItem = headerMenu.find((item) => {
    return (appInfo?.url || '')?.startsWith(item.route);
  });

  const activeMenuItemWithActive = activeMenuItem ? { ...activeMenuItem, active: true } : null;

  const uiCore = {
    user: clientUserInfo,
  };

  return (
    <TranslationContext.Provider value={appInfo.translation}>
      <div className="wrapper">
        <Header
          userData={clientUserInfo}
          url={appInfo.url}
          categories={categories}
          search={appInfo?.document?.search || ''}
        >
          <nav className="header-menu">
            <ul>
              {headerMenu.map(({ route, label, subCategories }) => {
                return (
                  <li
                    key={route}
                    className={className({
                      'header-menu__main-item': true,
                      '--active': route === activeMenuItemWithActive?.route,
                    })}
                  >
                    {subCategories ? (
                      <span className="header-menu__dropdown-btn">{label}</span>
                    ) : (
                      <a href={route}>{label}</a>
                    )}
                    {subCategories && (
                      <ul className="header-menu__dropdown">
                        {subCategories.map(({ name, name_en, url }) => (
                          <li key={url}>
                            <a href={`${catalogLink}/${url}`}>{name || name_en}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="header__buttons">
            {/*<button className="header__burger-btn">*/}
            {/*  <i className="icon icon-burger-btn" />*/}
            {/*</button>*/}
            <a className="header__button-basket" href={appInfo.translation.link('/cart')}>
              <i className="icon icon-basket" />
              <span id="cart-count">{appInfo?.cart?.count || 0}</span>
            </a>
          </div>
        </Header>
        <main>{children}</main>
        <Footer url={appInfo.url} shop={appInfo.user?.shops?.length > 0} />
      </div>
      <script
        id="uiCoreData"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(uiCore) }}
      ></script>
    </TranslationContext.Provider>
  );
};

export default MainLayout;
