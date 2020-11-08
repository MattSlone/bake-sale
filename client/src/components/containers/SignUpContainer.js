import { connect } from 'react-redux'
import SignUp from '../SignUp'
import { userSignUp } from '../../redux'

const mapStateToProps = state => {
  return {
    userData: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userSignUp: (formData) => dispatch(userSignUp(formData))
  }
}

const SignUpContainer = connect(mapStateToProps, mapDispatchToProps)(SignUp)

export default SignUpContainer
