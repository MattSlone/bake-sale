import axios from 'axios'

import {
  REQUEST_QUOTE_REQUEST,
  REQUEST_QUOTE_SUCCESS,
  REQUEST_QUOTE_FAILURE,
  GET_QUOTES_REQUEST,
  GET_QUOTES_SUCCESS,
  GET_QUOTES_FAILURE
} from './quoteTypes'

export const requestQuoteRequest = () => {
  return {
    type: REQUEST_QUOTE_REQUEST
  }
}

export const requestQuoteSuccess = (quote) => {
  return {
    type: REQUEST_QUOTE_SUCCESS,
    payload: quote
  }
}

export const requestQuoteFailure = (error) => {
  return {
    type: REQUEST_QUOTE_FAILURE,
    payload: error
  }
}

export const getQuotesRequest = () => {
  return {
    type: GET_QUOTES_REQUEST
  }
}

export const getQuotesSuccess = (quotes) => {
  return {
    type: GET_QUOTES_SUCCESS,
    payload: quotes
  }
}

export const getQuotesFailure = (error) => {
  return {
    type: GET_QUOTES_FAILURE,
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
        dispatch(requestQuoteSuccess(res.data.success))
        dispatch(getQuotes({ product: res.data.success.ProductId }))
      }
    } catch (error) {
      dispatch(requestQuoteFailure(error.message))
    }
  }
}

export const getQuotes = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(getQuotesRequest)
      const res = await axios.get('/api/quotes', {
        params: formData
      })
      if (res.data.error[0]) {
        dispatch(getQuotesFailure(res.data.error[0]))
      } else {
        dispatch(getQuotesSuccess(res.data.success))
      }
    } catch (error) {
      dispatch(getQuotesFailure(error.message))
    }
  }
}