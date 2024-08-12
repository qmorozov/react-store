import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import CurrentUser from '../../../../user/client/user.service.client';
import { Currency } from '../../../../payment/model/currency.enum';

import './index.scss';
import { useTranslations } from '../../../../translation/translation.context';

interface IShop {
  currency: Currency;
  description: string;
  id: number;
  image: string;
  isOnline: boolean;
  link: string;
  name: string;
  productsSold: number;
  rating: number;
  responseTime: number;
  since: string;
  type: number;
  url: string;
  uuid: string;
}

const UserDropdown = ({ userList, onChangeUUID, currentUser }) => {
  const tr = useTranslations();

  const menuList = [
    {
      label: tr.get('header.Feed'),
      route: tr.link('/feed'),
    },
    {
      label: tr.get('header.Orders'),
      route: tr.link('/cart/orders'),
    },
    {
      label: tr.get('header.Shop'),
      route: tr.link('/shop'),
    },
    {
      label: tr.get('header.Pricing'),
      route: tr.link('/pricing'),
    },
    {
      label: tr.get('header.Reviews'),
      route: tr.link('/reviews'),
    },
    {
      label: tr.get('header.Profile'),
      route: tr.link('/profile'),
    },
    {
      label: tr.get('header.Chats'),
      route: tr.link('/chats'),
    },
    {
      label: tr.get('header.StartSelling'),
      route: tr.link('/product/manage'),
    },
    {
      label: tr.get('header.Logout'),
      route: tr.link('/api/auth/logout'),
    },
  ];

  if (CurrentUser.role === 7) {
    menuList.splice(menuList.length - 1, 0, {
      label: tr.get('header.Admin'),
      route: tr.link('/admin/dashboard'),
    });
  }

  return currentUser.signed || currentUser.isOnline ? (
    <Menu as="div" className="menu">
      <div className="menu__button-block">
        <Menu.Button className="menu__button">
          {currentUser?.image ? <img src={currentUser?.image} alt={currentUser.name} /> : <i className={'account'} />}
        </Menu.Button>
      </div>
      <Menu.Items className="menu__items">
        {userList.map((listItem: IShop | typeof CurrentUser, index: number) =>
          listItem.uuid === currentUser.uuid ? null : (
            <div className="menu__item-block" key={index}>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => {
                      onChangeUUID(listItem.uuid);
                    }}
                    className={`${active ? 'bg-violet text-white' : 'text-gray'} menu__item-button`}
                  >
                    {tr.get('header.GoTo')} {listItem.name}
                  </button>
                )}
              </Menu.Item>
            </div>
          ),
        )}
        {menuList.map(({ label, route }, index) => (
          <div className="menu__item-block" key={index}>
            <Menu.Item>
              {({ active }) => (
                <a href={route} className={`${active ? 'bg-violet text-white' : 'text-gray'} menu__item-button`}>
                  {label}
                </a>
              )}
            </Menu.Item>
          </div>
        ))}
      </Menu.Items>
    </Menu>
  ) : (
    <a className="header__button-account" href={tr.link('/auth')}>
      <i className={'icon icon-person'} />
    </a>
  );
};

export default UserDropdown;
