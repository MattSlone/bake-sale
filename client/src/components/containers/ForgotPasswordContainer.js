import { connect } from 'react-redux'
import ForgotPassword from '../ForgotPassword'
import { forgotPassword } from '../../redux'

const mapDispatchToProps = dispatch => {
  return {
    forgotPassword: (formData) => dispatch(forgotPassword(formData))
  }
}

const ForgotPasswordContainer = connect(null, mapDispatchToProps)(ForgotPassword)

export default ForgotPasswordContainer
