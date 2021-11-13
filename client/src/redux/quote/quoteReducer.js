import {
  REQUEST_QUOTE_REQUEST,
  REQUEST_QUOTE_SUCCESS,
  REQUEST_QUOTE_FAILURE,
  GET_QUOTES_REQUEST,
  GET_QUOTES_SUCCESS,
  GET_QUOTES_FAILURE
} from './quoteTypes'

const initialState = {
  status: '',
  requestor: '',
  product: '',
  price: '',
  quotes: []
}

const quoteReducer = (state = initialState, action) => {
  switch(action.type) {
    case REQUEST_QUOTE_REQUEST: return {
      ...state,
      loading: true
    }
    case REQUEST_QUOTE_SUCCESS: 
    return {
      ...state,
      error: '',
      status: action.payload.status,
      product: action.payload.ProductId
    }
    case REQUEST_QUOTE_FAILURE: return {
      ...state,
      error: action.payload
    }
    case GET_QUOTES_REQUEST: return {
      ...state,
      loading: true
    }
    case GET_QUOTES_SUCCESS: 
    return {
      ...state,
      error: '',
      quotes: action.payload
    }
    case GET_QUOTES_FAILURE: return {
      ...state,
      error: action.payload
    }
    default: return state
  }
}

export default quoteReducer
