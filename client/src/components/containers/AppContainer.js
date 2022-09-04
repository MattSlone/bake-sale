import { connect } from 'react-redux'
import App from '../../App'
import { setAttemptedRoute } from '../../redux'

const mapStateToProps = state => {
  return {
    userData: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setAttemptedRoute: (route) => dispatch(setAttemptedRoute(route))
  }
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export default AppContainer
