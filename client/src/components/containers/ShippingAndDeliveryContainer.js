import { connect } from 'react-redux'
import ShippingAndDelivery from '../dashboard/ShippingAndDelivery'
import { getLatLngFromAddress, setDeliveryArea } from '../../redux'

const mapStateToProps = state => {
  return {
    area: state.shop.area
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setDeliveryArea: (formData) => dispatch(setDeliveryArea(formData)),
    getLatLngFromAddress: (formData) => dispatch(getLatLngFromAddress(formData))
  }
}

const ShippingAndDeliveryContainer = connect(mapStateToProps, mapDispatchToProps)(ShippingAndDelivery)

export default ShippingAndDeliveryContainer
