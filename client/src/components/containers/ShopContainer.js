import { connect } from 'react-redux'
import Shop from '../Shop'
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

const ShopContainer = connect(mapStateToProps, mapDispatchToProps)(Shop)

export default ShopContainer