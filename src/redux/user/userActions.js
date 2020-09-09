import axios from 'axios'

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


// SIGNUP
export const userSignupRequest = () => {
  return {
    type: USER_SIGNUP_REQUEST
  }
}

export const userSignupSuccess = (user) => {
  return {
    type: USER_SIGNUP_SUCCESS,
    payload: user
  }
}

export const userSignupFailure = (error) => {
  return {
    type: USER_SIGNUP_FAILURE,
    payload: error
  }
}

// LOGIN
export const userLoginRequest = () => {
  return {
    type: USER_LOGIN_REQUEST
  }
}

export const userLoginSuccess = (user) => {
  return {
    type: USER_LOGIN_SUCCESS,
    payload: user
  }
}

export const userLoginFailure = (error) => {
  return {
    type: USER_LOGIN_FAILURE,
    payload: error
  }
}

// LOGOUT
export const userLogoutRequest = () => {
  return {
    type: USER_LOGOUT_REQUEST
  }
}

export const userLogoutSuccess = () => {
  return {
    type: USER_LOGOUT_SUCCESS
  }
}

export const userLogoutFailure = (error) => {
  return {
    type: USER_LOGOUT_FAILURE,
    payload: error
  }
}

export const userSignup = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(userSignupRequest)
      const user = await axios.post('/register', formData)
      dispatch(userSignupSuccess(user.data))
    } catch(error) {
      dispatch(userSignupFailure(error.message))
    }
  }
}
