import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { purgeStoredState } from 'redux-persist'

const persistConfig = {
  key: 'root',
  storage,
}

import appReducer from './rootReducer'

/* https://github.com/rt2zz/redux-persist/issues/579 */
const rootReducer = (state, action) => {
  if (action.type === 'USER_SIGNOUT_SUCCESS') {
    purgeStoredState(persistConfig)
    return appReducer(undefined, action)
  }
  if (action.type === 'CREATE_SHOP_SUCCESS') {
    purgeStoredState(persistConfig)
    return appReducer({
      shop: state.shop,
      user: state.user
    }, action)
  }

  if (action.type === 'CREATE_PRODUCT_SUCCESS') {
    purgeStoredState(persistConfig)
    return appReducer({
      shop: state.shop,
      user: state.user
    }, action)
  }

  return appReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk, logger))
)

export const persistor = persistStore(store)
