import { connect } from 'react-redux'
import { setProductWeight } from '../../redux'
import Labeling from '../dashboard/Labeling'

const mapStateToProps = state => {
  return {
    shop: state.shop,
    product: state.product,
    user: state.user,
    weight: state.product.weight
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setProductWeight: (weight) => dispatch(setProductWeight(weight))
  }
}

const LabelingContainer = connect(mapStateToProps, mapDispatchToProps)(Labeling)

export default LabelingContainer
