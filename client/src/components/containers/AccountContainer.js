import { connect } from 'react-redux'
import Account from '../Account'
import { editUser } from '../../redux'

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editUser: (formData) => dispatch(editUser(formData))
  }
}

const AccountContainer = connect(mapStateToProps, mapDispatchToProps)(Account)

export default AccountContainer
