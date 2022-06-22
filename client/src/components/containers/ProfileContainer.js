import { connect } from 'react-redux'
import Profile from '../Profile'
import { editUser, getFormattedAddress } from '../../redux'

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editUser: (formData) => dispatch(editUser(formData)),
    getFormattedAddress: (formData) => dispatch(getFormattedAddress(formData))
  }
}

const ProfileContainer = connect(mapStateToProps, mapDispatchToProps)(Profile)

export default ProfileContainer
