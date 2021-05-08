import { connect } from 'react-redux'
import Ingredients from '../dashboard/Ingredients'
import { setIngredients } from '../../redux'

const mapStateToProps = state => {
  return {
    ingredients: state.product.ingredients
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setIngredients: (formData) => dispatch(setIngredients(formData))
  }
}

const IngredientsContainer = connect(mapStateToProps, mapDispatchToProps)(Ingredients)

export default IngredientsContainer
