import { RenderClientPage } from '../../../../app/client/render-client-page';
import { Translations } from '../../../../translation/translation.provider.client';
import FormControl from '../../../../layouts/shared/FormControl';
import Select from '../../../../layouts/shared/Select';

(async (elementId) => {
  const translation = await Translations.load('common', 'error');

  return RenderClientPage(() => {
    const countryData = [
      {
        id: 1,
        value: 'China',
        label: 'China',
      },
      {
        id: 2,
        value: 'India',
        label: 'India',
      },
      {
        id: 3,
        value: 'United States',
        label: 'United States',
      },
      {
        id: 4,
        value: 'Japan',
        label: 'Japan',
      },
    ];

    return (
      <section className="company-feedback-container --small">
        <h2 className="company-feedback__title">{translation.get('Contact Us')}</h2>
        <form>
          <div className="form-group__fields">
            <FormControl placeholder={translation.get('common.FirstName')}>
              <input />
            </FormControl>
            <FormControl placeholder={translation.get('Your Surname')}>
              <input />
            </FormControl>
          </div>
          <div className="form-group__fields">
            <FormControl type="number" placeholder={translation.get('common.PhoneNumber')}>
              <input type="number" />
            </FormControl>
          </div>
          <div className="form-group__fields">
            <FormControl type="number" placeholder={translation.get('Email')}>
              <input type="email" />
            </FormControl>
          </div>
          <div className="form-group__fields">
            <Select
              placeholder={translation.get('Subject')}
              options={[
                'Returns & Refunds',
                'Adding my product',
                'Adding my shop',
                'Delivery',
                'Payments',
                'Feedback',
                'Other',
              ].map((v) => ({
                id: v,
                value: v,
                label: v,
              }))}
              defaultValue={'Returns&Refunds'}
              defaultText={translation.get('Select subject')}
            />
          </div>

          <FormControl placeholder={translation.get('Message')}>
            <textarea />
          </FormControl>

          <button className="btn --primary">{translation.get('Send Message')}</button>

          <FormControl
            type="checkbox"
            placeholder={
              <>
                {translation.get('common.ProcessingAgreement.1')}{' '}
                <a>{translation.get('common.ProcessingAgreement.2')}</a>
              </>
            }
          >
            <input type="checkbox" defaultChecked />
          </FormControl>
        </form>
      </section>
    );
  }, elementId);
})('feedback-root');
