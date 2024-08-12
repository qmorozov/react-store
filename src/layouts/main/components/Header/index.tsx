import { FC, KeyboardEvent, ReactNode } from 'react';
import { Category } from '../../../../product/models/category.entity';
import { useTranslations } from '../../../../translation/translation.context';
import { CurrentUser } from '../../../../auth/models/CurrentUser';
import { Combobox, Menu } from '@headlessui/react';

interface IHeaderDropdown {
  id: string;
  label: string;
  link: string;
}

interface IHeaderProps {
  categories: Category[];
  children: ReactNode;
  userData: CurrentUser;
  search?: string;
  url: string;
}

const Header: FC<IHeaderProps> = ({ categories, url, children, userData, search }) => {
  const tr = useTranslations();

  const brandsData = [
    { id: 'rolex', label: 'Rolex', link: tr.link('/') },
    { id: 'patekPhilippe', label: 'Patek Philippe', link: tr.link('/') },
    { id: 'breitling', label: 'Breitling', link: tr.link('/') },
    { id: 'cartier', label: 'Cartier', link: tr.link('/') },
    { id: 'iwc', label: 'IWC', link: tr.link('/') },
    { id: 'jaegerLeCoultre', label: 'Jaeger-LeCoultre', link: tr.link('/') },
    { id: 'hublot', label: 'Hublot', link: tr.link('/') },
    { id: 'vacheronConstantin', label: 'Vacheron Constantin', link: tr.link('/') },
    { id: 'aLange&Söhne', label: 'A. Lange & Söhne', link: tr.link('/') },
    { id: 'breguet', label: 'Breguet', link: tr.link('/') },
    { id: 'hamilton', label: 'Hamilton', link: tr.link('/') },
    { id: 'oris', label: 'Oris', link: tr.link('/') },
    { id: 'omega', label: 'Omega', link: tr.link('/') },
    { id: 'audemarsPiguet', label: 'Audemars Piguet', link: tr.link('/') },
    { id: 'tudor', label: 'Tudor', link: tr.link('/') },
    { id: 'panerai', label: 'Panerai', link: tr.link('/') },
    { id: 'seiko', label: 'Seiko', link: tr.link('/') },
    { id: 'tagHeuer', label: 'TAG Heuer', link: tr.link('/') },
  ];

  const categoryData: IHeaderDropdown[] = [
    { id: 'mens', label: "Men's", link: tr.link('/') },
    { id: 'womens', label: "Women's", link: tr.link('/') },
    { id: 'new', label: 'New', link: tr.link('/') },
    { id: 'preowned', label: 'Pre-owned', link: tr.link('/') },
    { id: 'mechanical', label: 'Mechanical', link: tr.link('/') },
    { id: 'vintage', label: 'Vintage', link: tr.link('/') },
  ];

  const materialData: IHeaderDropdown[] = [
    { id: 'steel', label: 'Steel', link: tr.link('/') },
    { id: 'yellowGold', label: 'Yellow Gold', link: tr.link('/') },
    { id: 'roseGold', label: 'Rose Gold', link: tr.link('/') },
    { id: 'whiteGold', label: 'White Gold', link: tr.link('/') },
    { id: 'titanium', label: 'Titanium', link: tr.link('/') },
    { id: 'ceramic', label: 'Ceramic', link: tr.link('/') },
  ];

  const diameterData: IHeaderDropdown[] = [
    { id: '2025mm', label: '⌀ 20-25 mm', link: tr.link('/') },
    { id: '2530mm', label: '⌀ 25-30 mm', link: tr.link('/') },
    { id: '3035mm', label: '⌀ 30-35 mm', link: tr.link('/') },
    { id: '3540mm', label: '⌀ 35-40 mm', link: tr.link('/') },
    { id: '4045mm', label: '⌀ 40-45 mm', link: tr.link('/') },
    { id: '4550mm', label: '⌀ 45-50 mm', link: tr.link('/') },
  ];

  return (
    <header>
      <div className="header__top">
        <div className="header__top-container">
          <button className="header__burger-btn" id="header-burger-menu">
            <span></span>
          </button>
          <a className="header__logo" href={url !== '/' ? tr.link('/') : undefined}>
            <i className="icon icon-logo" />
            <span>qmorozov</span>
          </a>
          <div id="search" className="header__search search" data-search-defaultvalue={search}>
            <form className="header__search">
              <div className="header__search__block">
                <i className="icon icon-search" />
                <input name="query" placeholder={tr.get('header.SearchFormInput')} />
              </div>
              <button type="submit" className="btn --primary">
                <span>{tr.get('header.SearchFormButton')}</span>
                <i className="icon icon-search" />
              </button>
            </form>
          </div>
          <div className="header__buttons">
            <a className="header__button-wish" href={tr.link('/saved')}>
              <i className="icon icon-heart-empty" />
            </a>
            <a className="header__button-basket" href={tr.link('/cart')}>
              <i className="icon icon-basket" />
            </a>
            <div id="user-dropdown" className="dropdown-block header__button-account">
              <div className="menu__button-block">
                <button className="menu__button">
                  <i className="account" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="header__navigation">
        <div className="header__navigation-container">{children}</div>
      </div>
      <div className="header-dropdown">
        <div className="header-dropdown-container">
          <div className="header-dropdown__group --brands">
            <span>{tr.get('header.PageManage')}</span>
            <ul>
              {brandsData.map(({ id, label, link }) => (
                <li key={id} title={label}>
                  <a href={link}>{label}</a>
                </li>
              ))}
            </ul>
            <button>
              <p>{tr.get('header.All')}</p>
              <i className="icon icon-arrow"></i>
            </button>
          </div>
          <div className="header-dropdown__group --category">
            <span>{tr.get('header.Category')}</span>
            <ul>
              {categoryData.map(({ id, label, link }) => (
                <li key={id} title={label}>
                  <a href={link}>{label}</a>
                </li>
              ))}
            </ul>
            <button>
              <p>{tr.get('header.All')}</p>
              <i className="icon icon-arrow"></i>
            </button>
          </div>
          <div className="header-dropdown__group --material">
            <span>{tr.get('header.Material')}</span>
            <ul>
              {materialData.map(({ id, label, link }) => (
                <li key={id} title={label}>
                  <a href={link}>{label}</a>
                </li>
              ))}
            </ul>
            <button>
              <p>{tr.get('header.All')}</p>
              <i className="icon icon-arrow"></i>
            </button>
          </div>
          <div className="header-dropdown__group --diameter">
            <span>{tr.get('header.Diameter')}</span>
            <ul>
              {diameterData.map(({ id, label, link }) => (
                <li key={id} title={label}>
                  <a href={link}>{label}</a>
                </li>
              ))}
            </ul>
            <button>
              <p>{tr.get('header.All')}</p>
              <i className="icon icon-arrow"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
