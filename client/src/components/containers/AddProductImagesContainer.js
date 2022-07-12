import { connect } from 'react-redux'
import AddProductImages from '../dashboard/AddProductImages'
import { setProductImagesPreview } from '../../redux'

const mapStateToProps = state => {
  return {
    product: state.product
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProductImagesPreview: (files) => dispatch(setProductImagesPreview(files))
  }
}

const AddProductImagesContainer = connect(mapStateToProps, mapDispatchToProps)(AddProductImages)

export default AddProductImagesContainer
