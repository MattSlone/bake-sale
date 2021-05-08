import { connect } from 'react-redux'
import CreateShop from '../dashboard/CreateShop'
import { createShop } from '../../redux'

const mapStateToProps = state => {
  console.log('create shop', state)
  return {
    shop: state.shop,
    product: state.product,
    ingredients: state.ingredients,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createShop: (formData) => dispatch(createShop(formData))
  }
}

const CreateShopContainer = connect(mapStateToProps, mapDispatchToProps)(CreateShop)

export default CreateShopContainer
