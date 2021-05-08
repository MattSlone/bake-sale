import { combineReducers } from 'redux'
import userReducer from './user/userReducer'
import productReducer from './product/productReducer'
import shopReducer from './shop/shopReducer'

const appReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  shop: shopReducer,
})

export default appReducer
