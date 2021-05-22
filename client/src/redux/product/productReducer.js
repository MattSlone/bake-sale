import {
  SET_PRODUCT_IMAGES_PREVIEW,
  SET_INGREDIENTS,
  SET_PRICING_INVENTORY,
  SET_LISTING_DETAILS,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE
} from './productTypes'

const initialState = {
  name: '',
  description: '',
  category: '',
  automaticRenewal: true,
  ingredients: [],
  varieties: [],
  inventory: 0,
  imageFiles: [],
  loading: false,
  products: []
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
      varieties: action.payload.varieties,
      inventory: action.payload.inventory,
    }
    case CREATE_PRODUCT_REQUEST: return {
      ...state,
      loading: true
    }
    case CREATE_PRODUCT_SUCCESS: return {
      ...state,
      error: ''
    }
    case CREATE_PRODUCT_FAILURE: return {
      ...state,
      error: action.payload
    }
    case GET_PRODUCTS_REQUEST: return {
      ...state,
      loading: true
    }
    case GET_PRODUCTS_SUCCESS: return {
      ...state,
      products: action.payload,
      error: ''
    }
    case GET_PRODUCTS_FAILURE: return {
      products: '',
      error: action.payload
    }
    default: return state
  }
}

export default productReducer
