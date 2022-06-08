import { connect } from 'react-redux'
import Quote from '../Quote'
import { addToCart, getQuotes, resetCart } from '../../redux'

const mapStateToProps = state => {
  return {
    quote: state.quote,
    cart: state.cart
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (formData) => dispatch(addToCart(formData)),
    getQuotes: () => dispatch(getQuotes()),
    resetCart: () => dispatch(resetCart())
  }
}

const QuoteContainer = connect(mapStateToProps, mapDispatchToProps)(Quote)

export default QuoteContainer