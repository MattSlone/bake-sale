import { connect } from 'react-redux'
import CreateShop from '../dashboard/CreateShop'
import { createShop, editShop, setShop, setValidShop } from '../../redux'

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
    editShop: (formData) => dispatch(editShop(formData)),
    setShop: (formData) => dispatch(setShop(formData)),
    setValidShop: (status) => dispatch(setValidShop(status))
  }
}

const CreateShopContainer = connect(mapStateToProps, mapDispatchToProps)(CreateShop)

export default CreateShopContainer
