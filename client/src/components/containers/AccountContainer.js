import { connect } from 'react-redux'
import Account from '../Account'
import { editProfile } from '../../redux'

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editProfile: (formData) => dispatch(editProfile(formData))
  }
}

const AccountContainer = connect(mapStateToProps, mapDispatchToProps)(Account)

export default AccountContainer
