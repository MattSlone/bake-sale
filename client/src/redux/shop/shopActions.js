import axios from 'axios'

import {
    CREATE_SHOP_REQUEST,
    CREATE_SHOP_SUCCESS,
    CREATE_SHOP_FAILURE,
    EDIT_SHOP_REQUEST,
    EDIT_SHOP_SUCCESS,
    EDIT_SHOP_FAILURE,
    SET_DELIVERY_AREA,
    SET_SHOP,
    SET_VALID_SHOP,
    GET_LAT_LNG_REQUEST,
    GET_LAT_LNG_SUCCESS,
    GET_LAT_LNG_FAILURE,
    GET_SHOP_REQUEST,
    GET_SHOP_SUCCESS,
    GET_SHOP_FAILURE,
    GET_SHOP_FAILURE_NOT_FOUND,
    SET_PICKUP_ADDRESS,
    SET_PICKUP_SCHEDULE,
    SET_CONTACT,
    CREATE_STRIPE_ACCOUNT_REQUEST,
    CREATE_STRIPE_ACCOUNT_SUCCESS,
    CREATE_STRIPE_ACCOUNT_FAILURE,
    CHECK_STRIPE_DETAILS_SUBMITTED_REQUEST,
    CHECK_STRIPE_DETAILS_SUBMITTED_SUCCESS,
    CHECK_STRIPE_DETAILS_SUBMITTED_FAILURE,
    GET_FORMATTED_SHOP_ADDRESS_FAILURE,
    GET_FORMATTED_SHOP_ADDRESS_SUCCESS,
    GET_FORMATTED_SHOP_ADDRESS_REQUEST
 } from './shopTypes'

export const setDeliveryArea = (area) => {
  return {
    type: SET_DELIVERY_AREA,
    payload: area
  }
}

export const setPickupAddress = (address) => {
  return {
    type: SET_PICKUP_ADDRESS,
    payload: address
  }
}

export const setPickupSchedule = (schedule) => {
  return {
    type: SET_PICKUP_SCHEDULE,
    payload: schedule
  }
}

export const setContact = (contact) => {
  return {
    type: SET_CONTACT,
    payload: contact
  }
}

export const setShop = (shop) => {
  return {
    type: SET_SHOP,
    payload: shop
  }
}

export const setValidShop = (status) => {
  return {
    type: SET_VALID_SHOP,
    payload: status
  }
}

export const getLatLngRequest = () => {
  return {
    type: GET_LAT_LNG_REQUEST
  }
}

export const getLatLngSuccess = (latlng) => {
  return {
    type: GET_LAT_LNG_SUCCESS,
    payload: latlng
  }
}

export const getLatLngFailure = (error) => {
  return {
    type: GET_LAT_LNG_FAILURE,
    payload: error
  }
}

// CREATE
export const createShopRequest = () => {
  return {
    type: CREATE_SHOP_REQUEST
  }
}

export const createShopSuccess = (shop) => {
  return {
    type: CREATE_SHOP_SUCCESS,
    payload: shop
  }
}

export const createShopFailure = (error) => {
  return {
    type: CREATE_SHOP_FAILURE,
    payload: error
  }
}

export const createShop = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(createShopRequest)
      const res = await axios.post('/api/shop/create', formData)
      if(res.data.error[0]) {
        dispatch(createShopFailure(res.data.error[0]))
      }
      else {
        dispatch(createShopSuccess(res.data))
      }
    } catch(error) {
      dispatch(createShopFailure(error.message))
    }
  }
}

// EDIT
export const editShopRequest = () => {
  return {
    type: EDIT_SHOP_REQUEST
  }
}

export const editShopSuccess = (shop) => {
  return {
    type: EDIT_SHOP_SUCCESS,
    payload: shop
  }
}

export const editShopFailure = (error) => {
  return {
    type: EDIT_SHOP_FAILURE,
    payload: error
  }
}

export const editShop = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(editShopRequest)
      const res = await axios.post('/api/shop/update', formData)
      if(res.data.error[0]) {
        dispatch(editShopFailure(res.data.error[0]))
      }
      else {
        dispatch(editShopSuccess(res.data))
      }
    } catch(error) {
      dispatch(editShopFailure(error.message))
    }
  }
}

export const getShopRequest = () => {
  return {
    type: GET_SHOP_REQUEST
  }
}

export const getShopSuccess = (shop) => {
  return {
    type: GET_SHOP_SUCCESS,
    payload: shop
  }
}

export const getShopFailure = (error) => {
  return {
    type: GET_SHOP_FAILURE,
    payload: error
  }
}

export const createStripeAccountRequest = () => {
  return {
    type: CREATE_STRIPE_ACCOUNT_REQUEST
  }
}

export const createStripeAccountSuccess = (stripeAccountLink) => {
  return {
    type: CREATE_STRIPE_ACCOUNT_SUCCESS,
    payload: stripeAccountLink
  }
}

export const createStripeAccountFailure = (error) => {
  return {
    type: CREATE_STRIPE_ACCOUNT_FAILURE,
    payload: error
  }
}

export const getShopFailureNotFound = () => {
  return {
    type: GET_SHOP_FAILURE_NOT_FOUND,
    payload: ''
  }
}

export const checkStripeDetailsSubmittedRequest = () => {
  return {
    type: CHECK_STRIPE_DETAILS_SUBMITTED_REQUEST
  }
}

export const checkStripeDetailsSubmittedSuccess = (submitted) => {
  return {
    type: CHECK_STRIPE_DETAILS_SUBMITTED_SUCCESS,
    payload: submitted
  }
}

export const checkStripeDetailsSubmittedFailure = (error) => {
  return {
    type: CHECK_STRIPE_DETAILS_SUBMITTED_FAILURE,
    payload: error
  }
}

export const getFormattedShopAddressRequest = () => {
  return {
    type: GET_FORMATTED_SHOP_ADDRESS_REQUEST
  }
}

export const getFormattedShopAddressSuccess = (addressComponents) => {
  return {
    type: GET_FORMATTED_SHOP_ADDRESS_SUCCESS,
    payload: addressComponents
  }
}

export const getFormattedShopAddressFailure = (error) => {
  return {
    type: GET_FORMATTED_SHOP_ADDRESS_FAILURE,
    payload: error
  }
}

export const getFormattedShopAddress = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(getFormattedShopAddressRequest())
      const res = await axios.post('/api/user/address/components', formData)
      if(res.data.error) {
        dispatch(getFormattedShopAddressFailure(res.data.error))
      }
      else {
        dispatch(getFormattedShopAddressSuccess(res.data.success))
      }
    } catch(error) {
      dispatch(getFormattedShopAddressFailure(error.message))
    }
  }
}

export const getShop = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(getShopRequest())
      const res = await axios.get('/api/shop', {
        params: formData
      })
      if(res.data.error[0]) {
        dispatch(getShopFailure(res.data.error))
      }
      else if(!res.data.success) {
        dispatch(getShopFailureNotFound())
      }
      else {
        dispatch(getShopSuccess(res.data))
      }
    } catch(error) {
      dispatch(getShopFailure(error.message))
    }
  }
}

export const getLatLngFromAddress = (formData) => {
  console.log(formData)
  return async (dispatch) => {
    try {
      dispatch(getLatLngRequest)
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${formData}&key=AIzaSyACELINjQLeOcaE9QQQso_1mu3eG6wnnmw`
        )
      if(res.error_message) {
        dispatch(getLatLngFailure(res.error_message))
      }
      else {
        dispatch(getLatLngSuccess(res.data.results[0].geometry.location))
      }
    } catch(error) {
      dispatch(getLatLngFailure(error.message))
    }
  }
}

export const createStripeAccount = (shopId) => {
  return async (dispatch) => {
    try {
      dispatch(createStripeAccountRequest())
      const res = await axios.post('/api/shop/stripe/create', {
        shopId: shopId
      })
      if(res.error_message) {
        dispatch(createStripeAccountFailure(res.error_message))
      }
      else {
        dispatch(createStripeAccountSuccess(res.data.success))
      }
    } catch(error) {
      dispatch(createStripeAccountFailure(error.message))
    }
  }
}

export const checkStripeDetailsSubmitted = (accountId) => {
  return async (dispatch) => {
    try {
      dispatch(checkStripeDetailsSubmittedRequest())
      const res = await axios.post('/api/shop/stripe/checkDetailsSubmitted', {
        accountId: accountId
      })
      if(res.error_message) {
        dispatch(checkStripeDetailsSubmittedFailure(res.error_message))
      }
      else {
        dispatch(checkStripeDetailsSubmittedSuccess(res.data.success))
      }
    } catch(error) {
      dispatch(checkStripeDetailsSubmittedFailure(error.message))
    }
  }
}