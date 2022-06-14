import { connect } from 'react-redux'
import Profile from '../Profile'
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

const ProfileContainer = connect(mapStateToProps, mapDispatchToProps)(Profile)

export default ProfileContainer
