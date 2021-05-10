import {
    CREATE_SHOP_REQUEST,
    CREATE_SHOP_SUCCESS,
    CREATE_SHOP_FAILURE,
    SET_DELIVERY_AREA,
    SET_SHOP,
    GET_LAT_LNG_REQUEST,
    GET_LAT_LNG_SUCCESS,
    GET_LAT_LNG_FAILURE,
   } from './shopTypes'
  
  const initialState = {
    name: '',
    state: '',
    loading: false,
    created: false,
    area: {
      address: '',
      radius: 30000,
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
        ...state,
        area:{
          ...state.area,
          lat: action.payload.lat,
          lng: action.payload.lng
        },
        error: ''
      }
      case GET_LAT_LNG_FAILURE: return {
        ...state,
        area:{
          ...state.area,
          lat: '',
          lng: ''
        },
        error: action.payload
      }
      case SET_DELIVERY_AREA: return {
        ...state,
        area: action.payload
      }
      case SET_SHOP: return {
        ...state,
        name: action.payload.name,
        state: action.payload.state
      }
      case CREATE_SHOP_REQUEST: return {
        ...state,
        loading: true
      }
      case CREATE_SHOP_SUCCESS: return {
        id: action.payload.success.id,
        name: action.payload.success.name,
        state: action.payload.success.state,
        loading: false,
        created: false,
        area: {
          address: action.payload.success.address,
          radius: action.payload.success.radius,
          lat: action.payload.success.lat,
          lng: action.payload.success.lng
        },
        created: true,
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
  