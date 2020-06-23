import { SIGN_UP, LOG_IN, LOG_OUT } from './userTypes'

export const signUp = () => {
  return {
    type: SIGN_UP
  }
}

export const login = () => {
  return {
    type: LOG_IN
  }
}

export const logout = () => {
  return {
    type: LOG_OUT
  }
}
