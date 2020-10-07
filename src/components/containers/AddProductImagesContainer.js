import { connect } from 'react-redux'
import AddProductImages from '../dashboard/AddProductImages'
import { setProductImagesPreview } from '../../redux'

const mapStateToProps = state => {
  console.log(state)
  return {
    imageFiles: state.product.imageFiles
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProductImagesPreview: (files) => dispatch(setProductImagesPreview(files))
  }
}

const AddProductImagesContainer = connect(mapStateToProps, mapDispatchToProps)(AddProductImages)

export default AddProductImagesContainer
