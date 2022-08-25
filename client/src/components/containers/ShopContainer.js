import { connect } from 'react-redux'
import Shop from '../Shop'
import { getProducts, getShop } from '../../redux'

const mapStateToProps = state => {
  return {
    shop: state.shop,
    product: state.product,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProducts: (formData) => dispatch(getProducts(formData)),
    getShop: (formData) => dispatch(getShop(formData))
  }
}

const ShopContainer = connect(mapStateToProps, mapDispatchToProps)(Shop)

export default ShopContainer