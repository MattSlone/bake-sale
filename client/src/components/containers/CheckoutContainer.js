import { connect } from 'react-redux'
import Checkout from '../Checkout'
import { checkout } from '../../redux'

const mapStateToProps = state => {
  return {
    shop: state.shop,
    product: state.product,
    user: state.user,
    cart: state.cart
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkout: (items) => dispatch(checkout(items))
  }
}

const CheckoutContainer = connect(mapStateToProps, mapDispatchToProps)(Checkout)

export default CheckoutContainer