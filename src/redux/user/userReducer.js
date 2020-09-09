import {
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAILURE,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_FAILURE
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
      error: ''
    }
    case USER_SIGNUP_FAILURE: return {
      user: false,
      error: action.payload
    }
    case USER_LOGIN_REQUEST: return {
      ...state,
      loading: true
    }
    case USER_LOGIN_SUCCESS: return {
      loggedIn: true,
      user: action.payload,
      error: ''
    }
    case USER_LOGIN_FAILURE: return {
      loading: false,
      loggedIn: false,
      user: false,
      error: action.payload
    }
    case USER_LOGOUT_REQUEST: return {
      ...state,
      loading: true
    }
    case USER_LOGOUT_SUCCESS: return {
      loading: false,
      loggedIn: false,
      user: false,
      error: ''
    }
    case USER_LOGOUT_FAILURE: return {
      ...state,
      loading: false,
      error: action.payload
    }
    default: return state
  }
}

export default userReducer
