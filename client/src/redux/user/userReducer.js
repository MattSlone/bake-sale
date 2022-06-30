import { PURGE, REHYDRATE } from 'redux-persist';

import {
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAILURE,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNIN_FAILURE,
  USER_SIGNOUT_REQUEST,
  USER_SIGNOUT_SUCCESS,
  USER_SIGNOUT_FAILURE,
  EDIT_USER_REQUEST,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILURE,
  GET_FORMATTED_ADDRESS_FAILURE,
  GET_FORMATTED_ADDRESS_SUCCESS,
  GET_FORMATTED_ADDRESS_REQUEST,
  RESET_USER_ERROR
 } from './userTypes'

const initialState = {
  loading: false,
  loggedIn: false,
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  zipcode: '',
  seller: false,
  validAddress: false,
  error: '',
}

const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case USER_SIGNUP_REQUEST: return {
      ...state,
      loading: true
    }
    case USER_SIGNUP_SUCCESS: return {
      ...state,
      loggedIn: true,
      user: action.payload,
      firstName: action.payload.success.firstName,
      lastName: action.payload.success.lastName,
      street: action.payload.success.street,
      city: action.payload.success.city,
      state: action.payload.success.state,
      zipcode: action.payload.success.zipcode,
      seller: action.payload.success.seller,
      email: action.payload.success.email,
      username: action.payload.success.username,
      shopId: action.payload.success.shopId,
      error: ''
    }
    case USER_SIGNUP_FAILURE: return {
      user: false,
      error: action.payload
    }
    case USER_SIGNIN_REQUEST: return {
      ...state,
      loading: true
    }
    case USER_SIGNIN_SUCCESS: return {
      loggedIn: true,
      firstName: action.payload.success.firstName,
      lastName: action.payload.success.lastName,
      street: action.payload.success.street,
      city: action.payload.success.city,
      state: action.payload.success.state,
      zipcode: action.payload.success.zipcode,
      seller: action.payload.success.seller,
      email: action.payload.success.email,
      username: action.payload.success.username,
      user: action.payload,
      error: ''
    }
    case USER_SIGNIN_FAILURE: return {
      loading: false,
      loggedIn: false,
      user: false,
      error: action.payload
    }
    case USER_SIGNOUT_REQUEST: return {
      ...state,
      loading: true
    }
    case USER_SIGNOUT_FAILURE: return {
      ...state,
      loading: false,
      error: action.payload
    }
    case RESET_USER_ERROR: return {
      ...state,
      error: ''
    }
    case EDIT_USER_REQUEST: return {
      ...state,
      loading: true
    }
    case EDIT_USER_SUCCESS: return {
      loggedIn: true,
      loading: false,
      user: action.payload,
      email: action.payload.email,
      username: action.payload.username,
      firstName: action.payload.firstName,
      lastName: action.payload.lastName,
      street: action.payload.street,
      city: action.payload.city,
      state: action.payload.state,
      zipcode: action.payload.zipcode,
      seller: action.payload.seller,
      error: ''
    }
    case EDIT_USER_FAILURE: return {
      ...state,
      loading: false,
      error: action.payload
    }
    case GET_FORMATTED_ADDRESS_REQUEST: return {
      ...state,
      loading: true
    }
    case GET_FORMATTED_ADDRESS_SUCCESS: return {
      loggedIn: true,
      ...state,
      loading: false,
      street: action.payload.name,
      city: action.payload.locality,
      state: action.payload.region,
      zipcode: action.payload.postal_code,
      lat: action.payload.latitude,
      lng: action.payload.longitude,
      validAddress: true,
      error: ''
    }
    case GET_FORMATTED_ADDRESS_FAILURE: return {
      ...state,
      loading: false,
      street: '',
      city: '',
      state: '',
      zipcode: '',
      lat: '',
      lng: '',
      validAddress: false,
      error: action.payload
    }
    default: return state
  }
}

export default userReducer
