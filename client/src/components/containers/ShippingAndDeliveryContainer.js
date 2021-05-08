import { connect } from 'react-redux'
import ShippingAndDelivery from '../dashboard/ShippingAndDelivery'
import { getLatLng, setDeliveryArea } from '../../redux'

const mapStateToProps = state => {
  return {
    latlng: state.shop.latlng
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setDeliveryArea: (formData) => dispatch(setDeliveryArea(formData)),
    getLatLng: (formData) => dispatch(getLatLng(formData))
  }
}

const ShippingAndDeliveryContainer = connect(mapStateToProps, mapDispatchToProps)(ShippingAndDelivery)

export default ShippingAndDeliveryContainer
