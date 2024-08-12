import { useTranslations } from '../../../translation/translation.context';

const CompanyTeam = () => {
  const tr = useTranslations();

  const companyTeam = () =>
    Array(8).fill({
      image: '/images/productCard.png',
      email: 'email@gmail.com',
      name: 'Andriy Someone',
      position: 'CEO',
    });

  return (
    <section className="company-team-container --small">
      <h2 className="company-team__title">{tr.get('common.Team')}</h2>
      <div className="company-team__inner">
        <div className="company-team__items">
          {companyTeam().map(({ image, email, name, position }, index) => (
            <div className="company-team__item" key={index}>
              <div className="company-team__item-img">
                <img src={image} alt={name} />
              </div>
              <a href={`mailto:${email}`} className="company-team__item-email">
                {email}
              </a>
              <span className="company-team__item-name">{name}</span>
              <span className="company-team__item-position">{position}</span>
            </div>
          ))}
        </div>
      </div>
      <button className="company-team__button-next" title="Next">
        <i className="icon icon-arrow" />
      </button>
      <button className="company-team__button-prev" title="Prev">
        <i className="icon icon-arrow" />
      </button>
    </section>
  );
};

export default CompanyTeam;
