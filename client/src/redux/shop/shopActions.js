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
    GET_LAT_LNG_REQUEST,
    GET_LAT_LNG_SUCCESS,
    GET_LAT_LNG_FAILURE,
    GET_SHOP_REQUEST,
    GET_SHOP_SUCCESS,
    GET_SHOP_FAILURE,
    GET_SHOP_FAILURE_NOT_FOUND,
    SET_PICKUP_ADDRESS,
    SET_PICKUP_SCHEDULE,
    SET_CONTACT
 } from './shopTypes'

 import { getProducts } from '../product/productActions'

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
        dispatch(getProducts({shop: res.data.success.id}))
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

export const getShopFailureNotFound = () => {
  return {
    type: GET_SHOP_FAILURE_NOT_FOUND,
    payload: ''
  }
}

export const getShop = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(getShopRequest)
      const res = await axios.get('/api/shop', {
        params: formData
      })
      if(res.data.error[0]) {
        dispatch(getShopFailure(res.data.error[0]))
      }
      else if(res.data.success == null) {
        dispatch(getShopFailureNotFound())
      }
      else {
        dispatch(getShopSuccess(res.data))
        dispatch(getProducts({shop: res.data.success.id}))
      }
    } catch(error) {
      dispatch(getShopFailure(error.message))
    }
  }
}

export const getLatLngFromAddress = (formData) => {
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