import { connect } from 'react-redux'
import { getQuotes } from '../../redux'
import Quotes from '../dashboard/Quotes'

const mapStateToProps = state => {
  return {
    quote: state.quote
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getQuotes: (formData) => dispatch(getQuotes(formData))
  }
}

const QuotesContainer = connect(mapStateToProps, mapDispatchToProps)(Quotes)

export default QuotesContainer
