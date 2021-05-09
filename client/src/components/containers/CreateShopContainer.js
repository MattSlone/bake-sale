import { connect } from 'react-redux'
import CreateShop from '../dashboard/CreateShop'
import { createShop, setShop } from '../../redux'

const mapStateToProps = state => {
  return {
    shop: state.shop,
    product: state.product,
    ingredients: state.ingredients,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createShop: (formData) => dispatch(createShop(formData)),
    setShop: (formData) => dispatch(setShop(formData))
  }
}

const CreateShopContainer = connect(mapStateToProps, mapDispatchToProps)(CreateShop)

export default CreateShopContainer
