import { connect } from 'react-redux'
import Product from '../Product'
import { addToCart } from '../../redux'

const mapStateToProps = state => {
  return {
    shop: state.shop,
    product: state.product
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (formData) => dispatch(addToCart(formData))
  }
}

const ProductContainer = connect(mapStateToProps, mapDispatchToProps)(Product)

export default ProductContainer