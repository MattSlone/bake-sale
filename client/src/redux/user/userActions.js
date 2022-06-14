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
  EDIT_PROFILE_REQUEST,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_FAILURE
 } from './userTypes'

 import { getShop } from '../shop/shopActions'

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
export const editProfileRequest = () => {
  return {
    type: EDIT_PROFILE_REQUEST
  }
}

export const editProfileSuccess = () => {
  return {
    type: EDIT_PROFILE_SUCCESS
  }
}

export const editProfileFailure = (error) => {
  return {
    type: EDIT_PROFILE_FAILURE,
    payload: error
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

export const userSignUp = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(userSignUpRequest)
      const res = await axios.post('/api/signup', formData)
      if(res.data.error[0]) {
        dispatch(userSignInFailure(res.data.error[0]))
      }
      else {
        dispatch(getShop({ UserId: res.data.success.id }))
        dispatch(userSignUpSuccess(res.data))
      }
    } catch(error) {
      dispatch(userSignUpFailure(error.message))
    }
  }
}

export const userSignIn = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(userSignInRequest)
      const res = await axios.post('/api/signin', formData)
      if(res.data.error[0]) {
        dispatch(userSignInFailure(res.data.error[0]))
      }
      else {
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

export const editProfile = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(editProfileRequest())
      const res = await axios.post('/api/signin', formData)
      if(res.data.error[0]) {
        dispatch(editProfileFailure(res.data.error[0]))
      }
      else {
        dispatch(editProfileSuccess())
      }
    } catch(error) {
      dispatch(editProfileFailure(error.message))
    }
  }
}
