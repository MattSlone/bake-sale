import { connect } from 'react-redux'
import AddProduct from '../dashboard/AddProduct'
import {
  createProduct,
  setProductEdit,
  editProduct,
  resetProduct,
  setValidProduct
} from '../../redux'

const mapStateToProps = state => {
  return {
    shop: state.shop,
    product: state.product,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createProduct: (formData) => dispatch(createProduct(formData)),
    setProductEdit: (product) => dispatch(setProductEdit(product)),
    editProduct: (product) => dispatch(editProduct(product)),
    resetProduct: () => dispatch(resetProduct()),
    setValidProduct: (valid) => dispatch(setValidProduct(valid))
  }
}

const AddProductContainer = connect(mapStateToProps, mapDispatchToProps)(AddProduct)

export default AddProductContainer