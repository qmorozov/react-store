import { Dialog } from '@headlessui/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import React, { useCallback, useState } from 'react';
import CheckoutForm from '../CheckoutForm.client';

interface IPaymentCredentials {
  publishableKey: string;
  clientSecret: string;
}

interface IPaymentManager {
  pay: (...params: any[]) => void;
  credentials: ReturnType<typeof useState<IPaymentCredentials>>;
  getClient: () => Promise<any>;
}

const getStripeClient = (() => {
  let stripeClient: any;
  let stripePublishableKey: string;
  return async (publishableKey: IPaymentCredentials['publishableKey']) => {
    if (!publishableKey?.trim()?.length) {
      return null;
    }
    if (stripeClient && stripePublishableKey === publishableKey) {
      return stripeClient;
    }
    return loadStripe(publishableKey).then((res) => {
      stripeClient = res;
      stripePublishableKey = publishableKey;
      return res;
    });
  };
})();

export function usePayment(payCallback: (...params: any[]) => Promise<IPaymentCredentials>): IPaymentManager {
  const credentials = useState<IPaymentCredentials>(undefined);

  const pay = useCallback(async (...params: any[]) => {
    return credentials[1]({ ...(await payCallback(...params)) });
  }, []);

  const getClient = useCallback(
    () => getStripeClient(credentials?.[0]?.publishableKey),
    [credentials?.[0]?.publishableKey],
  );

  return { pay, credentials, getClient };
}

export const PaymentContext = React.createContext<IPaymentManager>(undefined);

export function usePaymentContext() {
  return React.useContext(PaymentContext);
}

export function PaymentPopup({ provider }: { provider?: IPaymentManager }) {
  const manager = provider || usePaymentContext();

  const options = {
    clientSecret: manager.credentials?.[0]?.clientSecret,
  };

  return (
    <Dialog
      open={!!manager.credentials?.[0]?.clientSecret}
      className="Dialog"
      onClose={() => manager.credentials?.[1]?.(null)}
    >
      <div className="DialogBackdrop" aria-hidden="true" />
      <div className="DialogLayout">
        <Dialog.Panel className="DialogContent">
          {/*<Dialog.Title className="DialogTitle">Deactivate account</Dialog.Title>*/}
          {/*<Dialog.Description className="DialogDescription">*/}
          {/*  This will permanently deactivate your account*/}
          {/*</Dialog.Description>*/}

          {!!manager.credentials?.[0]?.clientSecret && (
            <Elements options={options} stripe={manager.getClient()}>
              <CheckoutForm />
            </Elements>
          )}

          {/*<button onClick={() => setIsOpen(false)}>Deactivate</button>*/}
          {/*<button onClick={() => setIsOpen(false)}>Cancel</button>*/}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
