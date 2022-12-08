[Back](task.md)

# Solution 03 - show cart

Easy when you see it, right?

```query
query getServerBasket($basketModel: BasketModelInput!) {
  basket(basketModel: $basketModel) {
    total {
      gross
      net
      currency
      discount
    }
    cart {
      sku
      name
      path
      quantity
      attributes {
        attribute
        value
      }
      price {
        gross
        currency
      }
      images {
        url
        variants {
          url
          width
          height
        }
      }
    }
  }
}
```
