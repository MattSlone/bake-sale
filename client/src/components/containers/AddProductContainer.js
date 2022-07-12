import { connect } from 'react-redux'
import AddProduct from '../dashboard/AddProduct'

const mapStateToProps = state => {
  return {
    product: state.product
  }
}

const AddProductContainer = connect(mapStateToProps, null)(AddProduct)

export default AddProductContainer