import { connect } from 'react-redux'
import CustomProduct from '../CustomProduct'
import { requestQuote, getShop, setCustomForm } from '../../redux'

const mapStateToProps = state => {
  return {
    shop: state.shop,
    product: state.product,
    quote: state.quote,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    requestQuote: (formData) => dispatch(requestQuote(formData)),
    getShop: (id) => dispatch(getShop(id)),
    setCustomForm: (fields) => dispatch(setCustomForm(fields))
  }
}

const CustomProductContainer = connect(mapStateToProps, mapDispatchToProps)(CustomProduct)

export default CustomProductContainer