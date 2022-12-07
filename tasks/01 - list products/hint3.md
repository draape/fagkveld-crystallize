[Back](task.md)

# Hint 3

To get the pagination and filtering to work, you need to pass parameters. These
are sent by the front end code:

```graphql
query your_query_name (
  $first: Int
  $after: String
  $orderBy: OrderBy
  $language: String
  $filter: CatalogueSearchFilter
)
```
