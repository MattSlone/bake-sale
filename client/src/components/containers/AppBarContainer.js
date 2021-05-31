import { connect } from 'react-redux'
import AppBar from '../AppBar'
import { userSignOut, editQuantity, removeFromCart } from '../../redux'

const mapStateToProps = state => {
  return {
    userData: state.user,
    cart: state.cart
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userSignOut: () => dispatch(userSignOut()),
    editQuantity: (product) => dispatch(editQuantity(product)),
    removeFromCart: (cartIndex) => dispatch(removeFromCart(cartIndex))
  }
}

const AppBarContainer = connect(mapStateToProps, mapDispatchToProps)(AppBar)

export default AppBarContainer
