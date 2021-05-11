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
  USER_SIGNOUT_FAILURE
 } from './userTypes'

const initialState = {
  loading: false,
  loggedIn: false,
  error: '',
}

const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case USER_SIGNUP_REQUEST: return {
      ...state,
      loading: true
    }
    case USER_SIGNUP_SUCCESS: return {
      loggedIn: true,
      user: action.payload,
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
    default: return state
  }
}

export default userReducer
