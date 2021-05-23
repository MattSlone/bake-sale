import axios from 'axios'

import {
  ADD_TO_CART,
  REMOVE_FROM_CART
} from './cartTypes'

export const addToCart = (product) => {
  return {
    type: ADD_TO_CART,
    payload: product
  }
}

export const removeFromCart = () => {
  return {
    type: REMOVE_FROM_CART
  }
}