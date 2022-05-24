import { connect } from 'react-redux'
import { getOrders } from '../../redux'
import Orders from '../Orders'

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

const OrdersContainer = connect(mapStateToProps, mapDispatchToProps)(Orders)

export default OrdersContainer
