import {
  REQUEST_QUOTE_REQUEST,
  REQUEST_QUOTE_SUCCESS,
  REQUEST_QUOTE_FAILURE
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
    case REQUEST_QUOTE_SUCCESS: return {
      ...state,
      error: ''
    }
    case REQUEST_QUOTE_FAILURE: return {
      ...state,
      error: action.payload
    }
    default: return state
  }
}

export default quoteReducer
