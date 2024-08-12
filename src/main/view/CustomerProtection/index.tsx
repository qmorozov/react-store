import { useTranslations } from '../../../translation/translation.context';

const CustomerProtection = () => {
  const tr = useTranslations();

  return (
    <section className="customer-protection-container --small">
      <h6 className="customer-protection__title">
        <span>{tr.get('common.customerProtection.1')}</span>
        {tr.get('common.customerProtection.2')}
        <br />
        {tr.get('common.customerProtection.3')}
        <br />
        {tr.get('common.customerProtection.4')}
      </h6>
      <div className="customer-protection__items">
        <span className="customer-protection__item">{tr.get('common.AuthenticityGuarantee')}</span>
        <span className="customer-protection__item">{tr.get('common.GlobalMoneyBackGuarantee')}</span>
        <span className="customer-protection__item">{tr.get('common.QualityAndSafetyTeam')}</span>
      </div>
    </section>
  );
};

export default CustomerProtection;
