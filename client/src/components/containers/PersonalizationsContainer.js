import { connect } from 'react-redux'
import Personalization from '../dashboard/Personalization'
import { setPersonalizationPrompt } from '../../redux'

const mapStateToProps = state => {
  return {
    personalizationPrompt: state.product.personalizationPrompt
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setPersonalizationPrompt: (personalizationPrompt) => dispatch(setPersonalizationPrompt(personalizationPrompt))
  }
}

const PersonalizationContainer = connect(mapStateToProps, mapDispatchToProps)(Personalization)

export default PersonalizationContainer
