import { connect } from 'react-redux'
import Product from '../Product'
import { addToCart, getShop } from '../../redux'

const mapStateToProps = state => {
  return {
    shop: state.shop,
    product: state.product
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (formData) => dispatch(addToCart(formData)),
    getShop: (id) => dispatch(getShop(id))
  }
}

const ProductContainer = connect(mapStateToProps, mapDispatchToProps)(Product)

export default ProductContainer