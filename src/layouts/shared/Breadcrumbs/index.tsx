import { FC } from 'react';
import { useTranslations } from '../../../translation/translation.context';

interface ICrumbs {
  title: string;
  route?: string;
}

interface IBreadcrumbs {
  crumbs: ICrumbs[];
}

const Breadcrumbs: FC<IBreadcrumbs> = ({ crumbs }) => {
  const tr = useTranslations();
  const currentPage = (index: number) => index === crumbs.length - 1;

  return (
    <div className="breadcrumbs-container">
      <ul className="breadcrumbs__list">
        <li className="breadcrumbs__item">
          <a href={tr.link('/')}>
            <i className="icon icon-home" />
          </a>
        </li>
        {crumbs.map((crumb, index) => (
          <li key={`${crumb}_${index}`} className={`breadcrumbs__item ${currentPage(index) ? '--current-page' : ''}`}>
            <a href={crumb.route}>{crumb.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
