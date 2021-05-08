import { connect } from 'react-redux'
import App from '../../App'

const mapStateToProps = state => {
  return {
    userData: state.user
  }
}

const AppContainer = connect(mapStateToProps, null)(App)

export default AppContainer
