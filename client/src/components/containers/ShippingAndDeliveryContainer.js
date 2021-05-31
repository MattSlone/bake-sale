import { connect } from 'react-redux'
import ShippingAndDelivery from '../dashboard/ShippingAndDelivery'
import { getLatLngFromAddress, setDeliveryArea, setPickupAddress } from '../../redux'

const mapStateToProps = state => {
  return {
    shop: state.shop
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setDeliveryArea: (formData) => dispatch(setDeliveryArea(formData)),
    setPickupAddress: (pickupAddress) => dispatch(setPickupAddress(pickupAddress)),
    getLatLngFromAddress: (formData) => dispatch(getLatLngFromAddress(formData))
  }
}

const ShippingAndDeliveryContainer = connect(mapStateToProps, mapDispatchToProps)(ShippingAndDelivery)

export default ShippingAndDeliveryContainer
