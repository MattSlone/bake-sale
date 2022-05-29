import { connect } from 'react-redux'
import { getProducts } from '../../redux'
import Home from '../Home'

const mapStateToProps = state => {
  return {
    userData: state.user,
    product: state.product
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProducts: (fields) => dispatch(getProducts(fields))
  }
}

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home)

export default HomeContainer
