import { connect } from 'react-redux'
import { getOrders } from '../../redux'
import ShopOrders from '../dashboard/ShopOrders'

const mapStateToProps = state => {
  return {
    order: state.order
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getOrders: (formData) => dispatch(getOrders(formData))
  }
}

const ShopOrdersContainer = connect(mapStateToProps, mapDispatchToProps)(ShopOrders)

export default ShopOrdersContainer
