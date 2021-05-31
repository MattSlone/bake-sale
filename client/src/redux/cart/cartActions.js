import axios from 'axios'

import {
  ADD_TO_CART,
  EDIT_QUANTITY,
  REMOVE_FROM_CART
} from './cartTypes'

export const addToCart = (product) => {
  return {
    type: ADD_TO_CART,
    payload: product
  }
}

export const editQuantity = (product) => {
  return {
    type: EDIT_QUANTITY,
    payload: product
  }
}

export const removeFromCart = (index) => {
  return {
    type: REMOVE_FROM_CART,
    payload: index
  }
}