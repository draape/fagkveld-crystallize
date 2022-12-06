// TODO 03 - show cart

// Oppgave - Hente ut produktdetaljer til handlevogn
// Hint - query som brukes til å hente ut fra api
// Hint - $basketModel: BasketModelInput!
// Hint - service api

/*
locale,
      cart: clientBasket.cart.map(clientCartItemForAPI),
      voucherCode: clientBasket.voucherCode,
      crystallizeOrderId: clientBasket.crystallizeOrderId,
      klarnaOrderId: clientBasket.klarnaOrderId
*/

const GET_BASKET_QUERY = `
  query getServerBasket($basketModel: BasketModelInput!) {
    basket(basketModel: $basketModel) {
      
      total {
        gross
        net
        tax {
          name
          percent
        }
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
`;

export default GET_BASKET_QUERY;
