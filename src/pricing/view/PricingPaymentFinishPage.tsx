import { AppInfo } from '../../app/models/app-info';
import { Payment } from '../../payment/model/Payment';
import { PlanHistory } from '../models/PlanHistory';

const PricingPaymentFinishPage = (
  appInfo: AppInfo,
  payment: Payment | null,
  planInfo: PlanHistory | null,
  error?: Error | undefined,
): JSX.Element => {
  const translation = appInfo.translation;

  return (
    <section className="payment-container --small">
      <h1 className="payment-info__title">Thank you for plan subscribe</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium consectetur deleniti eaque error eveniet
        explicabo fuga molestiae, numquam porro, quas, quasi quibusdam quidem quod ratione rerum ut vel veritatis
        voluptas.
      </p>

      <strong>Error</strong>
      <pre>{JSON.stringify(error, null, 2)}</pre>
      <hr />
      <strong>Payment</strong>
      <pre>{JSON.stringify(payment, null, 2)}</pre>
      <hr />
      <strong>Plan info</strong>
      <pre>{JSON.stringify(planInfo, null, 2)}</pre>
      <hr />
      <a className="btn --primary" href="/">
        Ок
      </a>
    </section>
  );
};

export default PricingPaymentFinishPage;
