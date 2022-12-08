[Back](task.md)

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
