import produce from 'immer';

// TODO 01 - list products

export const SEARCH_QUERY = `

`;

export const orderByOptions = [
  {
    field: 'ITEM_NAME',
    direction: 'ASC'
  },
  {
    field: 'ITEM_NAME',
    direction: 'DESC'
  },
  {
    field: 'PRICE',
    direction: 'ASC'
  },
  {
    field: 'PRICE',
    direction: 'DESC'
  },
  {
    field: 'STOCK',
    direction: 'ASC'
  },
  {
    field: 'STOCK',
    direction: 'DESC'
  }
].map((o) => ({ value: `${o.field}_${o.direction}`, ...o }));

export const defaultSpec = {
  first: 25,
  orderBy: {
    field: orderByOptions[0].field,
    direction: orderByOptions[0].direction
  },
  filter: {
    priceVariant: 'default'
  },
  include: {}
};

export function urlToSpec({ query = {}, asPath }, locale) {
  const spec = produce(defaultSpec, (draft) => {
    function handleSingleAttribute(attr) {
      const [attribute, valuesAsString] = attr.split(':');
      const values = valuesAsString.split(',');
      draft.filter.productVariants.attributes.push({
        attribute,
        values
      });
    }

    draft.filter.priceVariant = locale.crystallizePriceVariant;

    draft.language = locale.crystallizeCatalogueLanguage;

    draft.filter.productVariants = {};

    if (asPath) {
      const path = asPath.split('?')[0];
      if (path !== '/search') {
        if (!draft.filter.include) {
          draft.filter.include = {};
        }

        // Category page. Only show products
        draft.filter.type = 'PRODUCT';

        // Only find products under this path (ex: /shop/chairs)
        draft.filter.include.paths = [path];

        // Only present the default product variants
        draft.filter.productVariants.isDefault = true;
      } else {
        delete draft.filter.include;
      }
    }

    if (query.attrs) {
      draft.filter.productVariants.attributes = [];
      if (Array.isArray(query.attrs)) {
        query.attrs.forEach(handleSingleAttribute);
      } else {
        handleSingleAttribute(query.attrs);
      }
    }

    const min = parseFloat(query.min, 10);
    const max = parseFloat(query.max, 10);
    if (!isNaN(min) || !isNaN(max)) {
      const priceRange = {};
      if (!isNaN(min)) {
        priceRange.min = min;
      }
      if (!isNaN(max)) {
        priceRange.max = max;
      }
      draft.filter.productVariants.priceRange = priceRange;
    }

    const first = parseInt(query.first, 10);
    if (!isNaN(first)) {
      draft.first = first;
    }
    if (query.before) {
      draft.before = query.before;
    }
    if (query.after) {
      draft.after = query.after;
    }

    const orderBy = orderByOptions.find((o) => o.value === query.orderby);
    if (orderBy) {
      draft.orderBy = { direction: orderBy.direction, field: orderBy.field };
    }

    if (query.searchTerm) {
      draft.filter.searchTerm = query.searchTerm;
    }
  });

  return spec;
}
