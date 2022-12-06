# Solution:

## part1: src\page-components\checkout\payment\stripe.js:

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


## part2: src\page-components\checkout\payment\stripe.js:
```
const stripeConfig = useQuery('stripeConfig', () =>
    
    ServiceApi({
      query: `
      {
        paymentProviders {
          stripe {
            config
          }
        }
      }
    `
    })
  );
```

## make sure you're using valid test cards: 
valid test cards: https://stripe.com/docs/testing