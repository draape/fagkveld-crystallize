/* eslint-disable react/display-name */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import styled from 'styled-components';
import { useQuery } from 'react-query';

import ServiceApi from 'lib/service-api';
import { useTranslation } from 'next-i18next';
import { useBasket } from 'components/basket';
import { Spinner } from 'ui/spinner';

import {
  Input,
  InputGroup,
  Label,
  PaymentSelector,
  PaymentProviders,
  PaymentButton,
  PaymentProvider,
  SectionHeader,
  CheckoutFormGroup
} from '../styles';
import Voucher from '../voucher';

const StripeCheckout = dynamic(() => import('./stripe'));

const Row = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const Inner = styled.div``;

export default function Payment() {
  const { t } = useTranslation(['checkout', 'customer']);
  const router = useRouter();
  const { basketModel, actions } = useBasket();
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState(null);
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const paymentConfig = useQuery('paymentConfig', () =>
    ServiceApi({
      query: `
      {
        paymentProviders {
          stripe {
            enabled
          }
        }
      }
    `
    })
  );

  // Handle locale with sub-path routing
  let multilingualUrlPrefix = '';
  if (window.location.pathname.startsWith(`/${router.locale}/`)) {
    multilingualUrlPrefix = '/' + router.locale;
  }

  const { firstName, lastName, email } = state;

  function getURL(path) {
    return `${location.protocol}//${location.host}${multilingualUrlPrefix}${path}`;
  }

  /**
   * The checkout model shared between all the payment providers
   * It contains everything needed to make a purchase and complete
   * an order
   */
  const checkoutModel = {
    basketModel,
    customer: {
      firstName,
      lastName,
      addresses: [
        {
          type: 'billing',
          email: email || null
        }
      ]
    },
    confirmationURL: getURL(`/confirmation/{crystallizeOrderId}?emptyBasket`),
    checkoutURL: getURL(`/checkout`),
    termsURL: getURL(`/terms`)
  };

  const paymentProviders = [
    {
      name: 'stripe',
      color: '#6773E6',
      logo: '/static/stripe-logo.png',
      render: () => (
        <PaymentProvider>
          <StripeCheckout
            checkoutModel={checkoutModel}
            onSuccess={(crystallizeOrderId) => {
              router.push(
                checkoutModel.confirmationURL.replace(
                  '{crystallizeOrderId}',
                  crystallizeOrderId
                )
              );
              scrollTo(0, 0);
            }}
          />
        </PaymentProvider>
      )
    }
  ];

  const enabledPaymentProviders = [];
  if (!paymentConfig.loading && paymentConfig.data) {
    const { paymentProviders } = paymentConfig.data.data;
    if (paymentProviders.stripe.enabled) {
      enabledPaymentProviders.push('stripe');
    }
  }

  return (
    <Inner>
      <CheckoutFormGroup>
        <SectionHeader>{t('title')}</SectionHeader>
        <form noValidate>
          <Row>
            <InputGroup>
              <Label htmlFor="firstname">{t('customer:firstName')}</Label>
              <Input
                name="firstname"
                type="text"
                value={firstName}
                onChange={(e) =>
                  setState({ ...state, firstName: e.target.value })
                }
                required
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="lastname">{t('customer:lastName')}</Label>
              <Input
                name="lastname"
                type="text"
                value={lastName}
                onChange={(e) =>
                  setState({ ...state, lastName: e.target.value })
                }
                required
              />
            </InputGroup>
          </Row>
          <Row>
            <InputGroup>
              <Label htmlFor="email">{t('customer:email')}</Label>
              <Input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setState({ ...state, email: e.target.value })}
                required
              />
            </InputGroup>
          </Row>
        </form>
      </CheckoutFormGroup>

      <Voucher />

      <CheckoutFormGroup withUpperMargin>
        <div>
          <SectionHeader>{t('choosePaymentMethod')}</SectionHeader>
          {paymentConfig.loading ? (
            <Spinner />
          ) : (
            <div>
              {enabledPaymentProviders.length === 0 ? (
                <i>{t('noPaymentProvidersConfigured')}</i>
              ) : (
                <PaymentProviders>
                  <PaymentSelector>
                    {enabledPaymentProviders.map((paymentProviderName) => {
                      const paymentProvider = paymentProviders.find(
                        (p) => p.name === paymentProviderName
                      );
                      if (!paymentProvider) {
                        return (
                          <small>
                            {t('paymentProviderNotConfigured', {
                              name: paymentProviderName
                            })}
                          </small>
                        );
                      }

                      return (
                        <PaymentButton
                          key={paymentProvider.name}
                          color={paymentProvider.color}
                          type="button"
                          selected={
                            selectedPaymentProvider === paymentProvider.name
                          }
                          onClick={() =>
                            setSelectedPaymentProvider(paymentProvider.name)
                          }
                        >
                          <img
                            src={paymentProvider.logo}
                            alt={t('paymentProviderLogoAlt', {
                              name: paymentProvider.name
                            })}
                          />
                        </PaymentButton>
                      );
                    })}
                  </PaymentSelector>

                  {paymentProviders
                    .find((p) => p.name === selectedPaymentProvider)
                    ?.render()}
                </PaymentProviders>
              )}
            </div>
          )}
        </div>
      </CheckoutFormGroup>
    </Inner>
  );
}
