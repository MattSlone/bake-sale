import { connect } from 'react-redux'
import Product from '../Product'

const mapStateToProps = state => {
  return {
    product: state.product
  }
}

const ProductContainer = connect(mapStateToProps, null)(Product)

export default ProductContainer