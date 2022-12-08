[Back](task.md)

# Hint 2

In order to get product information from the edges of a search node, you need to
"cast it" (also called an inline fragment) like this:

```graphql
edges {
  node {
    ... on Product {
      // all the things you need
    }
  }
}
```
