import { connect } from 'react-redux'
import { getOrders } from '../../redux'
import ShopOrder from '../dashboard/ShopOrder'

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

const ShopOrderContainer = connect(mapStateToProps, mapDispatchToProps)(ShopOrder)

export default ShopOrderContainer
