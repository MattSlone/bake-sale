import { connect } from 'react-redux'
import Drawer from '../Drawer'
import { getProducts } from '../../redux'

const mapStateToProps = state => {
  return {
    shop: state.shop
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProducts: (formData) => dispatch(getProducts(formData))
  }
}

const DrawerContainer = connect(mapStateToProps, mapDispatchToProps)(Drawer)

export default DrawerContainer