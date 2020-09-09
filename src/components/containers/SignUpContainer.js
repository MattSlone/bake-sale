import { connect } from 'react-redux'
import SignUp from '../SignUp'
import { userSignup } from '../../redux'

const mapStateToProps = state => {
  return {
    userData: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userSignup: (formData) => dispatch(userSignup(formData))
  }
}

const SignUpContainer = connect(mapStateToProps, mapDispatchToProps)(SignUp)

export default SignUpContainer
