import { connect } from 'react-redux'
import AppBar from '../AppBar'
import { userSignOut } from '../../redux'

const mapDispatchToProps = dispatch => {
  return {
    userSignOut: () => dispatch(userSignOut())
  }
}

const AppBarContainer = connect(null, mapDispatchToProps)(AppBar)

export default AppBarContainer
