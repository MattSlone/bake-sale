import { connect } from 'react-redux'
import PickupAndDeliveryOptions from '../dashboard/PickupAndDeliveryOptions'
import { 
  getLatLngFromAddress, 
  setDeliveryArea, 
  setPickupAddress, 
  setPickupSchedule,
  setContact,
  getFormattedShopAddress,
  setValidShop
 } from '../../redux'

const mapStateToProps = state => {
  return {
    shop: state.shop
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setDeliveryArea: (formData) => dispatch(setDeliveryArea(formData)),
    setPickupAddress: (pickupAddress) => dispatch(setPickupAddress(pickupAddress)),
    setPickupSchedule: (schedule) => dispatch(setPickupSchedule(schedule)),
    setContact: (contact) => dispatch(setContact(contact)),
    getLatLngFromAddress: (formData) => dispatch(getLatLngFromAddress(formData)),
    getFormattedShopAddress: (formData) => dispatch(getFormattedShopAddress(formData)),
    setValidShop: (status) => dispatch(setValidShop(status))
  }
}

const PickupAndDeliveryOptionsContainer = connect(mapStateToProps, mapDispatchToProps)(PickupAndDeliveryOptions)

export default PickupAndDeliveryOptionsContainer
