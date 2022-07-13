import { connect } from 'react-redux'
import AddCustomProduct from '../dashboard/AddCustomProduct'
import { 
  createProduct,
  resetProduct,
  editProduct,
  setProductEdit,
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
    resetProduct: (custom) => dispatch(resetProduct(custom)),
    editProduct: (product) => dispatch(editProduct(product)),
    setProductEdit: (product) => dispatch(setProductEdit(product)),
    setValidProduct: (valid) => dispatch(setValidProduct(valid))
  }
}

const AddCustomProductContainer = connect(mapStateToProps, mapDispatchToProps)(AddCustomProduct)

export default AddCustomProductContainer