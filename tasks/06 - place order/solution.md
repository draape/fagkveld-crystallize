[Back](task.md)

# src\page-components\checkout\payment\stripe.js:

```
 const response = await ServiceApi({
    query: `
        mutation confirmStripeOrder($checkoutModel: CheckoutModelInput!, $paymentIntentId: String!) {
        paymentProviders {
            stripe {
            confirmOrder(checkoutModel: $checkoutModel, paymentIntentId: $paymentIntentId) {
                success
                orderId
          }
        }
      }
    }
    `,
    variables: {
        checkoutModel,
        paymentIntentId: paymentIntent.id
    }
 });
```
