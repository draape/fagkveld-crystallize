[Back](task.md)

# src\page-components\checkout\payment\stripe.js:

```
mutation StripePaymentIntent($checkoutModel: CheckoutModelInput!) {
  paymentProviders {
    stripe {
      createPaymentIntent(checkoutModel: $checkoutModel)
    }
  }
}
```
