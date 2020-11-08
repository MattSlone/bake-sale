import { connect } from 'react-redux'
import Home from '../Home'

const mapStateToProps = state => {
  return {
    userData: state.user
  }
}

const HomeContainer = connect(mapStateToProps, null)(Home)

export default HomeContainer
