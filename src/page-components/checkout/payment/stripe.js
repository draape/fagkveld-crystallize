import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

import ServiceApi from 'lib/service-api';
import { Button, Spinner } from 'ui';
import { useTranslation } from 'next-i18next';

function Form({ stripeClientSecret, checkoutModel, onSuccess, onError }) {
  const { t } = useTranslation('checkout');
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState('idle');

  function handleSubmit(event) {
    event.preventDefault();

    setStatus('confirming');

    go();

    async function go() {
      if (!stripe || !elements) {
        setTimeout(go, 100);
        return;
      }

      const { customer } = checkoutModel;

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        stripeClientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${customer.firstName} ${customer.lastName}`
            }
          }
        }
      );

      if (error) {
        setStatus({ error });
      } else {
        // The payment has been processed!
        if (paymentIntent.status === 'succeeded') {
          // Show a success message to your customer
          // There's a risk of the customer closing the window before callback
          // execution. Set up a webhook or plugin to listen for the
          // payment_intent.succeeded event that handles any business critical
          // post-payment actions.

          // TODO 06 - place order
          const response = await ServiceApi({
            query: ``
          });

          const {
            success,
            orderId
          } = response.data.paymentProviders.stripe.confirmOrder;

          if (success) {
            onSuccess(orderId);
          } else {
            onError();
          }
        }
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <div style={{ marginTop: 25 }}>
        <Button
          type="submit"
          state={status === 'confirming' ? 'loading' : null}
          disabled={status === 'confirming'}
        >
          {t('payNow')}
        </Button>
      </div>
    </form>
  );
}

export default function StripeWrapper({ checkoutModel, ...props }) {
  const [stripeLoader, setStripeLoader] = useState(null);
  const stripeConfig = useQuery('stripeConfig', () =>
    // TODO 04 - load payment provider

    ServiceApi({
      query: ``
    })
  );

  useEffect(() => {
    if (stripeConfig.data && !stripeLoader) {
      setStripeLoader(
        loadStripe(
          stripeConfig.data.data.paymentProviders.stripe.config.publishableKey
        )
      );
    }
  }, [stripeConfig, stripeLoader]);

  // Get new paymentIntent
  const stripePaymentIntent = useQuery('stripePaymentIntent', () =>
    // TODO 05 - payment intent
    ServiceApi({
      query: `
        
      `,
      variables: {
        checkoutModel
      }
    })
  );

  const stripeClientSecret =
    stripePaymentIntent?.data?.data?.paymentProviders?.stripe
      ?.createPaymentIntent?.client_secret;

  if (stripeConfig.loading || !stripeLoader || !stripeClientSecret) {
    return <Spinner />;
  }

  return (
    <>
      <Head>
        <script key="stripe-js" src="https://js.stripe.com/v3/" async />
      </Head>
      <Elements locale="en" stripe={stripeLoader}>
        <Form
          {...props}
          checkoutModel={checkoutModel}
          stripeClientSecret={stripeClientSecret}
        />
      </Elements>
    </>
  );
}
