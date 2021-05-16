import { connect } from 'react-redux'
import Products from '../dashboard/Products'
import { getProducts } from '../../redux'

const mapStateToProps = state => {
  return {
    shop: state.shop,
    product: state.product,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProducts: (formData) => dispatch(getProducts(formData))
  }
}

const ProductsContainer = connect(mapStateToProps, mapDispatchToProps)(Products)

export default ProductsContainer