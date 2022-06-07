import { connect } from 'react-redux'
import { getQuotes, setQuotePrice } from '../../redux'
import Request from '../dashboard/Request'

const mapStateToProps = state => {
  return {
    quote: state.quote
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getQuotes: (formData) => dispatch(getQuotes(formData)),
    setQuotePrice: (formData) => dispatch(setQuotePrice(formData))
  }
}

const RequestContainer = connect(mapStateToProps, mapDispatchToProps)(Request)

export default RequestContainer
