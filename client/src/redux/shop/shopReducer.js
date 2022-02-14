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
    SET_CONTACT,
    CREATE_STRIPE_ACCOUNT_REQUEST,
    CREATE_STRIPE_ACCOUNT_SUCCESS,
    CREATE_STRIPE_ACCOUNT_FAILURE,
   } from './shopTypes'
  
  const initialState = {
    id: 0,
    name: '',
    state: '',
    allowPickups: true,
    pickupAddress: {
      street: '',
      city: '',
      state: 'FL',
      zipcode: '',
    },
    contact: {
      phone: '',
      email: ''
    },
    pickupSchedule: [
      {day: 'Sunday', start: "12:00", end: "12:00"},
      {day: 'Monday', start: "12:00", end: "12:00"},
      {day: 'Tuesday', start: "12:00", end: "12:00"},
      {day: 'Wednesday', start: "12:00", end: "12:00"},
      {day: 'Thursday', start: "12:00", end: "12:00"},
      {day: 'Friday', start: "12:00", end: "12:00"},
      {day: 'Saturday', start: "12:00", end: "12:00"}
    ],
    loading: false,
    created: false,
    area: {
      location: '',
      radius: 30000,
      lat: -3.745,
      lng: -38.523
    },
    stripeAccountLink: '',
    stripeAccountId: ''
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
      case CREATE_STRIPE_ACCOUNT_REQUEST: return {
        ...state,
        loading: true
      }
      case CREATE_STRIPE_ACCOUNT_SUCCESS: return {
        ...state,
        stripeAccountLink: action.payload,
        error: ''
      }
      case CREATE_STRIPE_ACCOUNT_FAILURE: return {
        ...state,
        error: action.payload
      }
      case SET_DELIVERY_AREA: return {
        ...state,
        area: action.payload
      }
      case SET_CONTACT: return {
        ...state,
        contact: action.payload
      }
      case SET_PICKUP_ADDRESS: return {
        ...state,
        allowPickups: action.payload.allowPickups,
        pickupAddress: {
          street: action.payload.street,
          city: action.payload.city,
          state: action.payload.state,
          zipcode: action.payload.zipcode
        }
      }
      case SET_PICKUP_SCHEDULE: return {
        ...state,
        pickupSchedule: action.payload
      }
      case SET_PICKUP_SCHEDULE: return {
        ...state,
        contact: action.payload
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
        ...state,
        id: action.payload.success.id,
        name: action.payload.success.name,
        state: action.payload.success.state,
        allowPickups: action.payload.success.allowPickups,
        pickupAddress: action.payload.success.PickupAddress,
        loading: false,
        area: {
          location: action.payload.success.location,
          radius: action.payload.success.radius,
          lat: action.payload.success.lat,
          lng: action.payload.success.lng
        },
        pickupSchedule: action.payload.success.PickupSchedules,
        contact: action.payload.success.ShopContact,
        created: true,
        error: ''
      }
      case CREATE_SHOP_FAILURE: return {
        ...state,
        error: action.payload
      }
      case GET_SHOP_REQUEST: return {
        ...state,
        loading: true
      }
      case GET_SHOP_SUCCESS: return {
        ...state,
        id: action.payload.success.id,
        name: action.payload.success.name,
        state: action.payload.success.state,
        allowPickups: action.payload.success.allowPickups,
        pickupAddress: action.payload.success.PickupAddress,
        loading: false,
        area: {
          location: action.payload.success.location,
          radius: action.payload.success.radius,
          lat: action.payload.success.lat,
          lng: action.payload.success.lng
        },
        pickupSchedule: action.payload.success.PickupSchedules,
        contact: action.payload.success.ShopContact,
        created: true,
        stripeAccountId: action.payload.success.stripeAccountId,
        error: ''
      }
      case GET_SHOP_FAILURE: return {
        error: action.payload
      }
      case GET_SHOP_FAILURE_NOT_FOUND: return {
        ...state
      }
      case EDIT_SHOP_REQUEST: return {
        ...state,
        loading: true
      }
      case EDIT_SHOP_SUCCESS: return {
        ...state,
        id: action.payload.success.id,
        name: action.payload.success.name,
        state: action.payload.success.state,
        allowPickups: action.payload.success.allowPickups,
        pickupAddress: action.payload.success.PickupAddress,
        loading: false,
        created: false,
        area: {
          location: action.payload.success.location,
          radius: action.payload.success.radius,
          lat: action.payload.success.lat,
          lng: action.payload.success.lng
        },
        pickupSchedule: action.payload.success.PickupSchedules,
        contact: action.payload.success.ShopContact,
        created: true,
        error: ''
      }
      case EDIT_SHOP_FAILURE: return {
        shop: '',
        error: action.payload
      }
      default: return state
    }
  }
  
  export default shopReducer
  