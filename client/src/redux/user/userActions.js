import axios from 'axios'

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
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  EDIT_USER_REQUEST,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILURE,
  GET_FORMATTED_ADDRESS_FAILURE,
  GET_FORMATTED_ADDRESS_SUCCESS,
  GET_FORMATTED_ADDRESS_REQUEST,
  IS_LOGGED_IN_FAILURE,
  IS_LOGGED_IN_SUCCESS,
  IS_LOGGED_IN_REQUEST,
  RESET_USER_ERROR,
  RESET_USER,
  SET_ATTEMPTED_ROUTE
 } from './userTypes'

 import { getShop } from '../shop/shopActions'

export const setAttemptedRoute = (route) => {
  return {
    type: SET_ATTEMPTED_ROUTE,
    payload: route
  }
}

// SIGNUP
export const userSignUpRequest = () => {
  return {
    type: USER_SIGNUP_REQUEST
  }
}

export const userSignUpSuccess = (user) => {
  return {
    type: USER_SIGNUP_SUCCESS,
    payload: user
  }
}

export const userSignUpFailure = (error) => {
  return {
    type: USER_SIGNUP_FAILURE,
    payload: error
  }
}

// Forgot Password
export const forgotPasswordRequest = () => {
  return {
    type: FORGOT_PASSWORD_REQUEST
  }
}

export const forgotPasswordSuccess = () => {
  return {
    type: FORGOT_PASSWORD_SUCCESS
  }
}

export const forgotPasswordFailure = () => {
  return {
    type: FORGOT_PASSWORD_FAILURE
  }
}

// Signin
export const userSignInRequest = () => {
  return {
    type: USER_SIGNIN_REQUEST
  }
}

export const userSignInSuccess = (user) => {
  return {
    type: USER_SIGNIN_SUCCESS,
    payload: user
  }
}

export const userSignInFailure = (error) => {
  return {
    type: USER_SIGNIN_FAILURE,
    payload: error
  }
}

// EDIT PROFILE
export const editUserRequest = () => {
  return {
    type: EDIT_USER_REQUEST
  }
}

export const editUserSuccess = (user) => {
  return {
    type: EDIT_USER_SUCCESS,
    payload: user
  }
}

export const editUserFailure = (error) => {
  return {
    type: EDIT_USER_FAILURE,
    payload: error
  }
}

export const resetUserError = () => {
  return {
    type: RESET_USER_ERROR
  }
}

export const resetUser = () => {
  return {
    type: RESET_USER
  }
}

// SIGNOUT
export const userSignOutRequest = () => {
  return {
    type: USER_SIGNOUT_REQUEST
  }
}

// SIGNOUT
export const userSignOutSuccess = () => {
  return {
    type: USER_SIGNOUT_SUCCESS
  }
}

export const userSignOutFailure = (error) => {
  return {
    type: USER_SIGNOUT_FAILURE,
    payload: error
  }
}

export const getFormattedAddressRequest = () => {
  return {
    type: GET_FORMATTED_ADDRESS_REQUEST
  }
}

export const getFormattedAddressSuccess = (addressComponents) => {
  return {
    type: GET_FORMATTED_ADDRESS_SUCCESS,
    payload: addressComponents
  }
}

export const getFormattedAddressFailure = (error) => {
  return {
    type: GET_FORMATTED_ADDRESS_FAILURE,
    payload: error
  }
}

export const isLoggedInRequest = () => {
  return {
    type: IS_LOGGED_IN_REQUEST
  }
}

export const isLoggedInSuccess = () => {
  return {
    type: IS_LOGGED_IN_SUCCESS
  }
}

export const isLoggedInFailure = (error) => {
  return {
    type: IS_LOGGED_IN_FAILURE,
    payload: error
  }
}

export const userSignUp = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(userSignUpRequest())
      const res = await axios.post('/api/signup', formData)
      if(res.data.error) {
        dispatch(userSignUpFailure(res.data.error))
      }
      else {
        // dispatch(getShop({ UserId: res.data.success.id }))
        dispatch(userSignUpSuccess({ message: 'You\'re signed up! Check your email for confirmation.' }))
      }
    } catch(error) {
      if (error.response) {
        dispatch(userSignUpFailure("There was an issue signing up"))
        return
      }
      dispatch(userSignUpFailure(JSON.stringify(error)))
    }
  }
}

export const isLoggedIn = () => {
  return async (dispatch) => {
    try {
      dispatch(isLoggedInRequest())
      const res = await axios.get('/api/user')
      if(res.data.error) {
        dispatch(isLoggedInFailure(res.data.error))
      }
      else {
        dispatch(isLoggedInSuccess())
      }
    } catch(err) {
      dispatch(isLoggedInFailure(err))
    }
  }
}

export const userSignIn = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(userSignInRequest())
      const res = await axios.post('/api/signin', formData)
      if(res.data.error) {
        dispatch(userSignInFailure(res.data.error))
      }
      else {
        console.log(res.data)
        dispatch(getShop({ UserId: res.data.success.id }))
        dispatch(userSignInSuccess(res.data))
      }
    } catch(error) {
      dispatch(userSignInFailure(error.message))
    }
  }
}

export const forgotPassword = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(forgotPasswordRequest())
      
      if(res.data.error[0]) {
        dispatch(forgotPasswordFailure())
      }
      else {
        dispatch(forgotPasswordSuccess())
      }
    } catch(error) {
      dispatch(forgotPasswordFailure())
    }
  }
}

export const userSignOut = () => {
  return async (dispatch) => {
    try {
      dispatch(userSignOutRequest)
      const res = await axios.get('/api/signout')
      dispatch(userSignOutSuccess(res.data))
    } catch(error) {
      dispatch(userSignOutFailure(error.message))
    }
  }
}

export const editUser = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(editUserRequest())
      const res = await axios.post('/api/user/edit', formData)
      console.log(res.data)
      if('error' in res.data) {
        dispatch(editUserFailure(res.data.error))
      }
      else {
        dispatch(editUserSuccess(res.data.success))
      }
    } catch(error) {
      dispatch(editUserFailure(error.message))
    }
  }
}

export const getFormattedAddress = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(getFormattedAddressRequest())
      const res = await axios.post('/api/user/address/components', formData)
      if(res.data.error) {
        dispatch(getFormattedAddressFailure(res.data.error))
      }
      else {
        dispatch(getFormattedAddressSuccess(res.data.success))
      }
    } catch(error) {
      dispatch(getFormattedAddressFailure(error))
    }
  }
}
