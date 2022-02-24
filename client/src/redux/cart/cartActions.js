import axios from 'axios'

import {
  ADD_TO_CART,
  EDIT_QUANTITY,
  REMOVE_FROM_CART,
  CHECKOUT_REQUEST,
  CHECKOUT_SUCCESS,
  CHECKOUT_FAILURE
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

export const checkoutRequest = () => {
  return {
    type: CHECKOUT_REQUEST
  }
}

export const checkoutSuccess = (clientSecret) => {
  return {
    type: CHECKOUT_SUCCESS,
    payload: clientSecret
  }
}

export const checkoutFailure = (error) => {
  return {
    type: CHECKOUT_FAILURE,
    payload: error
  }
}

export const checkout = (items) => {
  const formData = {
    items: items
  }
  return async (dispatch) => {
    try {
      dispatch(checkoutRequest())
      const res = await axios.post('/api/order/intent', formData)
      if (res.data.error[0]) {
        dispatch(checkoutFailure(res.data.error[0]))
      } else {
        dispatch(checkoutSuccess(res.data.success))
      }
    } catch (error) {
      dispatch(checkoutFailure(error.message))
    }
  }
}