import React, { useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripePaymentElementOptions } from '@stripe/stripe-js';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   if (!stripe) {
  //     return;
  //   }
  //
  //   const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');
  //
  //   if (!clientSecret) {
  //     return;
  //   }
  //
  //   stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
  //     switch (paymentIntent.status) {
  //       case 'succeeded':
  //         setMessage('Payment succeeded!');
  //         break;
  //       case 'processing':
  //         setMessage('Your payment is processing.');
  //         break;
  //       case 'requires_payment_method':
  //         setMessage('Your payment was not successful, please try again.');
  //         break;
  //       default:
  //         setMessage('Something went wrong.');
  //         break;
  //     }
  //   });
  // }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const info = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pricing`,
      },
    });

    console.warn(info);

    const { error } = info;

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <div className="payment-submit-toolbar">
        <button className="btn --primary" disabled={isLoading || !stripe || !elements} type="submit">
          {isLoading ? <div className="spinner"></div> : 'Pay now'}
        </button>
      </div>
      {message && <div className="field-error --alone">{message}</div>}
    </form>
  );
}
