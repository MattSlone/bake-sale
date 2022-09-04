import { connect } from 'react-redux'
import { ProvideAuth } from '../../hooks/use-auth'
import {
  userSignIn,
  userSignUp,
  userSignOut,
  resetUserError,
  resetUser,
  isLoggedIn,
  setAttemptedRoute
} from '../../redux'

const mapStateToProps = state => {
  return {
    userData: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userSignIn: (formData) => dispatch(userSignIn(formData)),
    userSignUp: (formData) => dispatch(userSignUp(formData)),
    userSignOut: () => dispatch(userSignOut()),
    isLoggedIn: () => dispatch(isLoggedIn()),
    resetUserError: () => dispatch(resetUserError()),
    resetUser: () => dispatch(resetUser()),
    setAttemptedRoute: (route) => dispatch(setAttemptedRoute(route))
  }
}

const ProvideAuthContainer = connect(mapStateToProps, mapDispatchToProps)(ProvideAuth)

export default ProvideAuthContainer
