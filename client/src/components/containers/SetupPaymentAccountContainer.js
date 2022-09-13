import { connect } from 'react-redux'
import SetupPaymentAccount from '../dashboard/SetupPaymentAccount'
import { createStripeAccount, checkStripeDetailsSubmitted, getShop } from '../../redux'

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
    getShop: (params) => dispatch(getShop(params)),
    createStripeAccount: (shopId) => dispatch(createStripeAccount(shopId)),
    checkStripeDetailsSubmitted: (accountId) => dispatch(checkStripeDetailsSubmitted(accountId))
  }
}

const SetupPaymentAccountContainer = connect(mapStateToProps, mapDispatchToProps)(SetupPaymentAccount)

export default SetupPaymentAccountContainer
