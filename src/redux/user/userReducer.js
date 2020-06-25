import { SIGN_UP, LOG_IN, LOG_OUT } from './userTypes'

const initialState = {
  loggedIn: false,
  registered: false,
  test: 'testing redux'
}

const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case SIGN_UP: return {
      ...state,
      loggedIn: true
    }
    case LOG_IN: return {
      ...state,
      loggedIn: true
    }
    case LOG_OUT: return {
      ...state,
      loggedIn: false
    }
    default: return state
  }
}

export default userReducer
