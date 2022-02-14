import { connect } from 'react-redux'
import SetupPaymentAccount from '../dashboard/SetupPaymentAccount'
import { createStripeAccount } from '../../redux'

const mapStateToProps = state => {
  return {
    shop: state.shop,
    product: state.product,
    ingredients: state.ingredients,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createStripeAccount: (shopId) => dispatch(createStripeAccount(shopId))
  }
}

const SetupPaymentAccountContainer = connect(mapStateToProps, mapDispatchToProps)(SetupPaymentAccount)

export default SetupPaymentAccountContainer
