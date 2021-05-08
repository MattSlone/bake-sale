import {
  SET_PRODUCT_IMAGES_PREVIEW,
  SET_INGREDIENTS,
  SET_PRICING_INVENTORY,
  SET_LISTING_DETAILS,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE
} from './productTypes'

const initialState = {
  name: '',
  description: '',
  category: '',
  automaticRenewal: true,
  ingredients: [],
  price: 0.00,
  inventory: 0,
  imageFiles: [],
  loading: false
}

const productReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_PRODUCT_IMAGES_PREVIEW: return {
      ...state,
      imageFiles: action.payload,
    }
    case SET_INGREDIENTS: return {
      ...state,
      ingredients: action.payload,
    }
    case SET_LISTING_DETAILS: return {
      ...state,
      name: action.payload.name,
      description: action.payload.description,
      category: action.payload.category,
      automaticRenewal: action.payload.automaticRenewal
    }
    case SET_PRICING_INVENTORY: return {
      ...state,
      price: action.payload.price,
      inventory: action.payload.inventory,
    }
    case CREATE_PRODUCT_REQUEST: return {
      ...state,
      loading: true
    }
    case CREATE_PRODUCT_SUCCESS: return {
      product: action.payload,
      error: ''
    }
    case CREATE_PRODUCT_FAILURE: return {
      product: '',
      error: action.payload
    }
    default: return state
  }
}

export default productReducer
