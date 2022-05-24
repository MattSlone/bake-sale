import {
  ADD_TO_CART,
  EDIT_QUANTITY,
  REMOVE_FROM_CART,
  CHECKOUT_REQUEST,
  CHECKOUT_SUCCESS,
  CHECKOUT_FAILURE,
  RESET_CART
} from './cartTypes'

const initialState = {
  products: [],
  loading: false,
  clientSecret: '',
  error: ''
}

const cartReducer = (state = initialState, action) => {
  switch(action.type) {
    case ADD_TO_CART: return {
      products: [...state.products, 
      {
        product: action.payload.product,
        personalization: action.payload.personalization,
        variation: action.payload.variation,
        quantity: action.payload.quantity,
        fulfillment: action.payload.fulfillment,
        addons: action.payload.addons,
        clientSidePrice: action.payload.clientSidePrice
      }]
    }
    case EDIT_QUANTITY:
      return {
        products: state.products.map((product, i) => {
          if(i === action.payload.cartIndex) {
            return {
              ...product,
              quantity: action.payload.quantity
            }
          } else {
            return product
          }
        })
      }
    case REMOVE_FROM_CART: return {
      products: state.products.filter((product, index) => index != action.payload)
    }
    case CHECKOUT_REQUEST: return {
      ...state,
      loading: true
    }
    case CHECKOUT_SUCCESS: return {
      ...state,
      clientSecret: action.payload,
      error: ''
    }
    case CHECKOUT_FAILURE: return {
      ...state,
      error: action.payload
    }
    case RESET_CART: return initialState
    default: return state
  }
}

export default cartReducer
