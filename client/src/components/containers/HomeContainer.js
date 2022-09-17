import { connect } from 'react-redux'
import { getProducts, getProductsCount, setCategory } from '../../redux'
import Home from '../Home'

const mapStateToProps = state => {
  return {
    userData: state.user,
    product: state.product
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProducts: (fields) => dispatch(getProducts(fields)),
    getProductsCount: (fields) => dispatch(getProductsCount(fields)),
    setCategory: (category) => dispatch(setCategory(category))
  }
}

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home)
export default HomeContainer
