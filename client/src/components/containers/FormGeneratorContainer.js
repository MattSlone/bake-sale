import { connect } from 'react-redux'
import { setCustomForm } from '../../redux'
import FormGenerator from '../dashboard/FormGenerator'

const mapStateToProps = state => {
  return {
    fields: state.product.fields
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setCustomForm: (fields) => dispatch(setCustomForm(fields))
  }
}

const FormGeneratorContainer = connect(mapStateToProps, mapDispatchToProps)(FormGenerator)

export default FormGeneratorContainer
