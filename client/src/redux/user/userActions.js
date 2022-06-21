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
  GET_FORMATTED_ADDRESS_REQUEST
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

export const getFormattedAddressSuccess = (address) => {
  const addressComponents = Object.fromEntries(address.filter(
    component => {
      const types = component.types.filter(type => [
        'street_number',
        'route',
        'locality',
        'administrative_area_level_1',
        'postal_code'].includes(type))
        return types.length > 0
    }
  ).map(component => [component.types[0], component.long_name]))
  if (Object.keys(addressComponents).length < 5) {
    return async (dispatch) => {
      dispatch(getFormattedAddressFailure("There was an issue validating your address."))
    }
  }
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

export const userSignUp = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(userSignUpRequest())
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
      dispatch(userSignInRequest())
      const res = await axios.post('/api/signin', formData)
      if(res.data.error[0]) {
        dispatch(userSignInFailure(res.data.error[0]))
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
      if(res.data.error[0]) {
        dispatch(editUserFailure(res.data.error[0]))
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
  console.log(formData)
  return async (dispatch) => {
    try {
      dispatch(getFormattedAddressRequest())
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${formData}&key=AIzaSyACELINjQLeOcaE9QQQso_1mu3eG6wnnmw`
        )
      if(res.error_message) {
        dispatch(getFormattedAddressFailure(res.error_message))
      } else if (res.data.status != "OK") {
        dispatch(getFormattedAddressFailure("There was an issue validating your address."))
      }
      else {
        dispatch(getFormattedAddressSuccess(res.data.results[0].address_components))
      }
    } catch(error) {
      dispatch(getFormattedAddressFailure(error.message))
    }
  }
}
