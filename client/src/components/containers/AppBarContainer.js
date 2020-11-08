import { connect } from 'react-redux'
import AppBar from '../AppBar'
import { userSignOut } from '../../redux'

const mapStateToProps = state => {
  return {
    userData: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userSignOut: () => dispatch(userSignOut())
  }
}

const AppBarContainer = connect(mapStateToProps, mapDispatchToProps)(AppBar)

export default AppBarContainer
