import { connect } from 'react-redux'
import Drawer from '../Drawer'
import { getProducts } from '../../redux'

const mapDispatchToProps = dispatch => {
  return {
    getProducts: (formData) => dispatch(getProducts(formData))
  }
}

const DrawerContainer = connect(null, mapDispatchToProps)(Drawer)

export default DrawerContainer