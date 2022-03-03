import axios from 'axios'

import {
  REFUND_REQUEST,
  REFUND_SUCCESS,
  REFUND_FAILURE
} from './orderTypes'

export const refundRequest = () => {
  return {
    type: REFUND_REQUEST
  }
}

export const refundSuccess = (status) => {
  return {
    type: REFUND_SUCCESS,
    payload: status
  }
}

export const refundFailure = (error) => {
  return {
    type: REFUND_FAILURE,
    payload: error
  }
}

export const refund = (orderId) => {
  const formData = {
    orderId: orderId
  }
  return async (dispatch) => {
    try {
      dispatch(refundRequest())
      const res = await axios.post('/api/order/refund', formData)
      if (res.data.error[0]) {
        dispatch(refundFailure(res.data.error[0]))
      } else {
        dispatch(refundSuccess(res.data.success))
      }
    } catch (error) {
      dispatch(refundFailure(error.message))
    }
  }
}