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
  
  const initialState = {
    id: 0,
    name: '',
    valid: false,
    allowPickups: false,
    pickupAddress: {
      street: '',
      city: '',
      state: 'FL',
      zipcode: '',
      validAddress: false
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
    stripeAccountId: '',
    stripeDetailsSubmitted: false,
    error: ''
  }
  
  const shopReducer = (state = initialState, action) => {
    switch(action.type) {
      case SET_VALID_SHOP: return {
        ...state,
        valid: action.payload
      }
      case GET_LAT_LNG_REQUEST: return {
        ...state,
        loading: true
      }
      case GET_LAT_LNG_SUCCESS: return {
        ...state,
        loading: false,
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
        loading: false,
        error: action.payload
      }
      case CREATE_STRIPE_ACCOUNT_REQUEST: return {
        ...state,
        loading: true
      }
      case CREATE_STRIPE_ACCOUNT_SUCCESS: return {
        ...state,
        stripeAccountLink: action.payload,
        loading: false,
        error: ''
      }
      case CREATE_STRIPE_ACCOUNT_FAILURE: return {
        ...state,
        error: action.payload,
        loading: false
      }
      case CHECK_STRIPE_DETAILS_SUBMITTED_REQUEST: return {
        ...state,
        loading: true
      }
      case CHECK_STRIPE_DETAILS_SUBMITTED_SUCCESS: return {
        ...state,
        stripeDetailsSubmitted: action.payload,
        loading: false,
        error: ''
      }
      case CHECK_STRIPE_DETAILS_SUBMITTED_FAILURE: return {
        ...state,
        loading: false,
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
      }
      case CREATE_SHOP_REQUEST: return {
        ...state,
        loading: true
      }
      case CREATE_SHOP_SUCCESS: return {
        ...state,
        id: action.payload.success.id,
        name: action.payload.success.name,
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
        ...state,
        error: action.payload
      }
      case GET_SHOP_FAILURE_NOT_FOUND: return {
        ...state,
        error: ''
      }
      case EDIT_SHOP_REQUEST: return {
        ...state,
        loading: true
      }
      case EDIT_SHOP_SUCCESS: return {
        ...state,
        id: action.payload.success.id,
        name: action.payload.success.name,
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
      case GET_FORMATTED_SHOP_ADDRESS_REQUEST: return {
        ...state,
        loading: true
      }
      case GET_FORMATTED_SHOP_ADDRESS_SUCCESS: return {
        ...state,
        loggedIn: true,
        loading: false,
        pickupAddress: {
          street: action.payload.street_number + ' ' + action.payload.route,
          city: action.payload.locality,
          state: action.payload.administrative_area_level_1,
          zipcode: action.payload.postal_code,
          validAddress: true
        },
        error: ''
      }
      case GET_FORMATTED_SHOP_ADDRESS_FAILURE: return {
        ...state,
        loading: false,
        pickupAddress: {
          street: '',
          city: '',
          state: '',
          zipcode: '',
          validAddress: false
        },
        error: action.payload
      }
      default: return state
    }
  }
  
  export default shopReducer
  