import { connect } from 'react-redux'
import SignUp from '../SignUp'
import { signUp, login, logout } from '../../redux'

const mapStateToProps = state => {
  return {
    test: state.user.test
  }
}

const mapDispatchToProps = dispatch => {
  return {
    signUp: () => dispatch(signUp()),
    login: () => dispatch(login()),
    logout: () => dispatch(logout())
  }
}

const SignUpContainer = connect(mapStateToProps, mapDispatchToProps)(SignUp)

export default SignUpContainer
