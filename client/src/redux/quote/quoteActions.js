import axios from 'axios'

import {
  REQUEST_QUOTE_REQUEST,
  REQUEST_QUOTE_SUCCESS,
  REQUEST_QUOTE_FAILURE
} from './quoteTypes'

export const requestQuoteRequest = () => {
  return {
    type: REQUEST_QUOTE_REQUEST
  }
}

export const requestQuoteSuccess = () => {
  return {
    type: REQUEST_QUOTE_SUCCESS
  }
}

export const requestQuoteFailure = (error) => {
  return {
    type: REQUEST_QUOTE_FAILURE,
    payload: error
  }
}

export const requestQuote = (formData) => {
  return async (dispatch) => {
    dispatch(requestQuoteRequest)
    try {
      const res = await axios.post('/api/quote/create', formData)
      if (res.data.error[0]) {
        dispatch(requestQuoteFailure(res.data.error[0]))
      } else {
        dispatch(requestQuoteSuccess)
      }
    } catch (error) {
      dispatch(requestQuoteFailure(error.message))
    }
  }
}