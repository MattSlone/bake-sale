import {
  ADD_TO_CART,
  REMOVE_FROM_CART
} from './cartTypes'

const initialState = {
  products: []
}

const cartReducer = (state = initialState, action) => {
  switch(action.type) {
    case ADD_TO_CART: return {
      products: [...state.products, 
      {
        product: action.payload.product,
        variation: action.payload.variation
      }]
    }
    case REMOVE_FROM_CART: return {
      ...state,
    }
    default: return state
  }
}

export default cartReducer
