import { combineReducers } from 'redux'
import userReducer from './user/userReducer'
import productReducer from './product/productReducer'
import shopReducer from './shop/shopReducer'
import cartReducer from './cart/cartReducer'
import quoteReducer from './quote/quoteReducer'

const appReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  shop: shopReducer,
  cart: cartReducer,
  quote: quoteReducer
})

export default appReducer
