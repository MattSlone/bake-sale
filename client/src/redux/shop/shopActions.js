import axios from 'axios'

import {
    CREATE_SHOP_REQUEST,
    CREATE_SHOP_SUCCESS,
    CREATE_SHOP_FAILURE,
    SET_DELIVERY_AREA,
    GET_LAT_LNG_REQUEST,
    GET_LAT_LNG_SUCCESS,
    GET_LAT_LNG_FAILURE,
 } from './shopTypes'

export const setDeliveryArea = (area) => {
  return {
    type: SET_DELIVERY_AREA,
    payload: area
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

export const getLatLng = (formData) => {
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