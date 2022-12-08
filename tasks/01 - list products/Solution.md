[Back](task.md)

# Solution 01 - list products

The entire query you need to make search and everything work is listed here!

```graphql
query CATALOGUE_SEARCH(
  $first: Int
  $after: String
  $orderBy: OrderBy
  $language: String
  $filter: CatalogueSearchFilter
) {
  search(
    first: $first
    after: $after
    orderBy: $orderBy
    filter: $filter
    language: $language
  ) {
    aggregations {
      totalResults
    }
    pageInfo {
      totalNodes
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        name
        path
        type
        ... on Product {
          topics {
            id
            name
          }
          matchingVariant {
            sku
            priceVariants {
              identifier
              name
              currency
              price
            }
            images {
              url
              variants {
                width
                url
              }
            }
          }
        }
      }
    }
  }
}
```
