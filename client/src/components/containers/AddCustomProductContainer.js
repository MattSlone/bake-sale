import { connect } from 'react-redux'
import AddCustomProduct from '../dashboard/AddCustomProduct'
import { createProduct, resetProduct, editProduct, setProductEdit } from '../../redux'

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
    resetProduct: () => dispatch(resetProduct()),
    editProduct: (product) => dispatch(editProduct(product)),
    setProductEdit: (product) => dispatch(setProductEdit(product)),
  }
}

const AddCustomProductContainer = connect(mapStateToProps, mapDispatchToProps)(AddCustomProduct)

export default AddCustomProductContainer