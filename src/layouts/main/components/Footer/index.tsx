import { FC } from 'react';
import { useTranslations } from '../../../../translation/translation.context';
import Social from '../../../shared/Social';

interface IFooter {
  shop: boolean;
  url: string;
}

const Footer: FC<IFooter> = ({ shop, url }) => {
  const tr = useTranslations();
  const languages = (Object.keys(tr.available || {}) || ['en']).map((lang) => ({
    code: lang,
    label: `language.${lang}`,
    link: tr.languageLink(lang),
  }));

  const currentLanguage = languages.find((l) => l.code === tr.language);
  const isSingleLanguage = languages.length === 1;

  const footerMenu = [
    {
      title: tr.get('footer.Selling.title'),
      list: [
        { route: tr.link('/'), label: tr.get('footer.Selling.EstimateMyProduct') },
        { route: tr.link('/'), label: tr.get('footer.Selling.SellMyProduct') },
        { route: tr.link('/'), label: tr.get('footer.Selling.CreateMyShop') },
        { route: tr.link('/page/advice-for-seller'), label: tr.get('footer.Selling.AdviceForSellers') },
        { route: tr.link('/pricing'), label: tr.get('footer.Selling.Pricing') },
      ],
    },
    {
      title: tr.get('footer.Buyer.title'),
      list: [
        { route: tr.link('/page/delivery-and-payment'), label: tr.get('footer.Buyer.DeliveryAndPayment') },
        { route: tr.link('/page/guarantees'), label: tr.get('footer.Buyer.Guarantees') },
        { route: tr.link('/page/return-policy'), label: tr.get('footer.Buyer.ReturnPolicy') },
        { route: tr.link('/page/safety-rules'), label: tr.get('footer.Buyer.SafetyRules') },
        { route: tr.link('/page/pages-help'), label: tr.get('footer.Buyer.PagesHelp') },
      ],
    },
    {
      title: tr.get('footer.About.title'),
      list: [
        { route: tr.link('/company'), label: tr.get('footer.About.Company') },
        { route: tr.link('/contact'), label: tr.get('footer.About.Contacts') },
        { route: tr.link('/faq'), label: tr.get('footer.About.FAQ') },
      ],
    },
    {
      title: tr.get('footer.Settings.title'),
      list: [
        {
          route: '',
          label: isSingleLanguage ? (
            <li>
              <a href="/">{tr.get(currentLanguage.label)}</a>
            </li>
          ) : (
            <select data-select-redirect defaultValue={currentLanguage.link}>
              {languages.map(({ label, link }) => (
                <option key={link} value={link}>
                  {tr.get(label)}
                </option>
              ))}
            </select>
          ),
        },
        { route: tr.link('/'), label: 'United States' },
        { route: tr.link('/'), label: 'USD' },
      ],
    },
  ];

  return (
    <footer className="footer-container">
      <div className="footer__buttons-container --small">
        <a className="btn --primary" href={tr.link('/product/manage')}>
          {tr.get('footer.SellMyProduct')}
        </a>
        <a className="btn --dark" href={tr.link('/shop/manage')}>
          {tr.get(`footer.${shop ? 'Edit' : 'Add'}MyShop`)}
        </a>
      </div>
      <nav className="footer__menu-container --small">
        {footerMenu.map((menuItem, index) => (
          <div className="footer__menu-item" key={`${menuItem.title}_${index}`}>
            <p>{menuItem.title}</p>
            <ul>
              {menuItem.list.map(({ route, label }, index) => (
                <li key={index}>{typeof label === 'string' ? <a href={route}>{label}</a> : label}</li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="footer__social">
        <Social title="google" />
        <Social title="twitter" />
        <Social title="facebook" />
        <Social title="youtube" />
      </div>
      <div className="container--wide footer-bottom">
        <div className="footer__logo">
          <a href={url !== '/' ? tr.link('/') : undefined}>
            <i className="icon icon-logo" />
          </a>
          <span>qmorozov</span>
        </div>
        <div className="footer__links">
          <a href={tr.link('/page/privacy-policy')}>{tr.get('footer.PrivacyPolicy')}</a>
          <a href={tr.link('/page/terms-and-conditions')}>{tr.get('footer.Terms&Conditions')}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
