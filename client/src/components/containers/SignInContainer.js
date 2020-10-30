import { connect } from 'react-redux'
import SignIn from '../SignIn'
import { userSignIn } from '../../redux'

const mapStateToProps = state => {
  return {
    userData: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userSignIn: (formData) => dispatch(userSignIn(formData))
  }
}

const SignInContainer = connect(mapStateToProps, mapDispatchToProps)(SignIn)

export default SignInContainer
