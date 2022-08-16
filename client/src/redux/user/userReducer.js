import { PURGE, REHYDRATE } from 'redux-persist';

import {
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAILURE,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNIN_FAILURE,
  USER_SIGNOUT_REQUEST,
  USER_SIGNOUT_FAILURE,
  EDIT_USER_REQUEST,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILURE,
  GET_FORMATTED_ADDRESS_FAILURE,
  GET_FORMATTED_ADDRESS_SUCCESS,
  GET_FORMATTED_ADDRESS_REQUEST,
  RESET_USER,
  RESET_USER_ERROR,
  IS_LOGGED_IN_FAILURE,
  IS_LOGGED_IN_REQUEST,
  IS_LOGGED_IN_SUCCESS
 } from './userTypes'

const initialState = {
  loading: false,
  loggedIn: false,
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  street: '',
  street2: '',
  city: '',
  state: '',
  zipcode: '',
  seller: false,
  validAddress: false,
  error: '',
  message: ''
}

const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case USER_SIGNUP_REQUEST: return {
      ...state,
      validAddress: false,
      loading: true
    }
    case USER_SIGNUP_SUCCESS: return {
      ...state,
      loading: false,
      message: action.payload.message,
      error: ''
    }
    case USER_SIGNUP_FAILURE: return {
      user: false,
      loading: false,
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
      street2: action.payload.success.street2,
      city: action.payload.success.city,
      state: action.payload.success.state,
      zipcode: action.payload.success.zipcode,
      seller: action.payload.success.seller,
      email: action.payload.success.email,
      username: action.payload.success.username,
      user: action.payload,
      error: '',
      loading: false
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
      error: '',
      message: ''
    }
    case RESET_USER: return initialState
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
      street2: action.payload.street2,
      city: action.payload.city,
      state: action.payload.state,
      zipcode: action.payload.zipcode,
      seller: action.payload.seller,
      error: '',
      message: 'Your changes have been saved.'
    }
    case EDIT_USER_FAILURE: return {
      ...state,
      loading: false,
      error: action.payload
    }
    case GET_FORMATTED_ADDRESS_REQUEST: return {
      ...state,
      loading: true,
      message: 'validating address...'
    }
    case GET_FORMATTED_ADDRESS_SUCCESS: return {
      ...state,
      loading: false,
      street: action.payload.street,
      city: action.payload.city,
      state: action.payload.state,
      zipcode: action.payload.zipcode,
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
    case IS_LOGGED_IN_REQUEST: return {
      ...state,
      loading: true
    }
    case IS_LOGGED_IN_SUCCESS: return {
      ...state,
      loggedIn: true,
      loading: false,
      error: ''
    }
    case IS_LOGGED_IN_FAILURE: return {
      ...state,
      loggedIn: false,
      loading: false
    }
    default: return state
  }
}

export default userReducer
