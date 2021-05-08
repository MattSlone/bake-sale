import {
    CREATE_SHOP_REQUEST,
    CREATE_SHOP_SUCCESS,
    CREATE_SHOP_FAILURE,
    SET_DELIVERY_AREA,
    GET_LAT_LNG_REQUEST,
    GET_LAT_LNG_SUCCESS,
    GET_LAT_LNG_FAILURE,
   } from './shopTypes'
  
  const initialState = {
    shop: '',
    loading: false,
    area: {
      radius: 30000,
      lat: -3.745,
      lng: -38.523
    },
    latlng: {
      lat: -3.745,
      lng: -38.523
    }
  }
  
  const shopReducer = (state = initialState, action) => {
    switch(action.type) {
      case GET_LAT_LNG_REQUEST: return {
        ...state,
        loading: true
      }
      case GET_LAT_LNG_SUCCESS: return {
        latlng: action.payload,
        error: ''
      }
      case GET_LAT_LNG_FAILURE: return {
        latlng: '',
        error: action.payload
      }
      case SET_DELIVERY_AREA: return {
        ...state,
        area: action.payload
      }
      case CREATE_SHOP_REQUEST: return {
        ...state,
        loading: true
      }
      case CREATE_SHOP_SUCCESS: return {
        shop: action.payload,
        error: ''
      }
      case CREATE_SHOP_FAILURE: return {
        shop: '',
        error: action.payload
      }
      default: return state
    }
  }
  
  export default shopReducer
  