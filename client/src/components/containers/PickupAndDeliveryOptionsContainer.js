import { connect } from 'react-redux'
import PickupAndDeliveryOptions from '../dashboard/PickupAndDeliveryOptions'
import {
  setDeliveryArea, 
  setPickupAddress, 
  setPickupSchedule,
  setContact,
  getFormattedShopAddress,
  getFormattedShopAddressSuccess,
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
    getFormattedShopAddress: (formData) => dispatch(getFormattedShopAddress(formData)),
    getFormattedShopAddressSuccess: (formData) => dispatch(getFormattedShopAddressSuccess(formData)),
    setValidShop: (status) => dispatch(setValidShop(status))
  }
}

const PickupAndDeliveryOptionsContainer = connect(mapStateToProps, mapDispatchToProps)(PickupAndDeliveryOptions)

export default PickupAndDeliveryOptionsContainer
