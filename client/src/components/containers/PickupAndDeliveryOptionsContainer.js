import { connect } from 'react-redux'
import PickupAndDeliveryOptions from '../dashboard/PickupAndDeliveryOptions'
import {
  setDeliveryArea, 
  setPickupAddress, 
  setPickupSchedule,
  setContact,
  getFormattedShopAddress,
  getFormattedShopAddressRequest,
  setDeliveryDays,
  getFormattedShopAddressSuccess,
  setValidShop,
  getFormattedShopAddressFailure
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
    setDeliveryDays: (days) => dispatch(setDeliveryDays(days)),
    setContact: (contact) => dispatch(setContact(contact)),
    getFormattedShopAddress: (formData) => dispatch(getFormattedShopAddress(formData)),
    getFormattedShopAddressSuccess: (formData) => dispatch(getFormattedShopAddressSuccess(formData)),
    getFormattedShopAddressRequest: () => dispatch(getFormattedShopAddressRequest()),
    getFormattedShopAddressFailure: (error) => dispatch(getFormattedShopAddressFailure(error)),
    setValidShop: (status) => dispatch(setValidShop(status))
  }
}

const PickupAndDeliveryOptionsContainer = connect(mapStateToProps, mapDispatchToProps)(PickupAndDeliveryOptions)

export default PickupAndDeliveryOptionsContainer
