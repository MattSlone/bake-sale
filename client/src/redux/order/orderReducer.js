import {
  REFUND_REQUEST,
  REFUND_SUCCESS,
  REFUND_FAILURE,
  GET_ORDERS_REQUEST,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAILURE
} from './orderTypes'

const initialState = {
  orders: [],
  orderId: 0,
  productId: 0,
  loading: false,
  status: '',
  error: ''
}

const orderReducer = (state = initialState, action) => {
  switch(action.type) {
    case REFUND_REQUEST: return {
      ...state,
      loading: true
    }
    case REFUND_SUCCESS: return {
      ...state,
      status: action.payload,
      error: ''
    }
    case REFUND_FAILURE: return {
      ...state,
      error: action.payload
    }
    case GET_ORDERS_REQUEST: return {
      ...state,
      loading: true
    }
    case GET_ORDERS_SUCCESS: return {
      ...state,
      orders: action.payload,
      error: '',
      loading: false
    }
    case GET_ORDERS_FAILURE: return {
      ...state,
      error: action.payload,
      loading: false
    }
    default: return state
  }
}

export default orderReducer
