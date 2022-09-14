import { connect } from 'react-redux'
import Drawer from '../Drawer'
import { setCategory, getProducts, getProductsCount } from '../../redux'

const mapStateToProps = state => {
  return {
    shop: state.shop
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProducts: (formData) => dispatch(getProducts(formData)),
    getProductsCount: (formData) => dispatch(getProductsCount(formData)),
    setCategory: (category) => dispatch(setCategory(category))
  }
}

const DrawerContainer = connect(mapStateToProps, mapDispatchToProps)(Drawer)

export default DrawerContainer