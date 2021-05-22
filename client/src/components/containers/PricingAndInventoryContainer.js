import { connect } from 'react-redux'
import PricingAndInventory from '../dashboard/PricingAndInventory'
import { setPricingAndInventory } from '../../redux'

const mapStateToProps = state => {
  return {
    varieties: state.product.varieties,
    inventory: state.product.inventory
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setPricingAndInventory: (formData) => dispatch(setPricingAndInventory(formData))
  }
}

const PricingAndInventoryContainer = connect(mapStateToProps, mapDispatchToProps)(PricingAndInventory)

export default PricingAndInventoryContainer
