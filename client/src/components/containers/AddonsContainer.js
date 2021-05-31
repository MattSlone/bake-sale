import { connect } from 'react-redux'
import Addons from '../dashboard/Addons'
import { setAddons } from '../../redux'

const mapStateToProps = state => {
  return {
    addons: state.product.addons
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setAddons: (addons) => dispatch(setAddons(addons))
  }
}

const AddonsContainer = connect(mapStateToProps, mapDispatchToProps)(Addons)

export default AddonsContainer
