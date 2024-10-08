import {
  SET_PRODUCT_IMAGES_PREVIEW,
  SET_INGREDIENTS,
  SET_PRICING_INVENTORY,
  SET_LISTING_DETAILS,
  SET_ADDONS,
  SET_PERSONALIZATIONS,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  GET_PRODUCTS_COUNT_REQUEST,
  GET_PRODUCTS_COUNT_SUCCESS,
  GET_PRODUCTS_COUNT_FAILURE,
  SET_PRODUCT_EDIT,
  EDIT_PRODUCT_REQUEST,
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_FAILURE,
  RESET_PRODUCT,
  SET_CUSTOM_FORM,
  SET_PRODUCT_WEIGHT,
  SET_VALID_PRODUCT,
  SET_CATEGORY
} from './productTypes'

const initialState = {
  id: 0,
  custom: false,
  published: false,
  name: '',
  description: '',
  category: '',
  processingTime: 1,
  automaticRenewal: true,
  ingredients: [],
  varieties: [],
  addons: [],
  personalizationPrompt: '',
  inventory: 0,
  imageFiles: [],
  productImages: [],
  weight: 0,
  loading: false,
  products: [],
  fields: [],
  count: 0,
  filterCategory: '',
  valid: false
}

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCT_IMAGES_PREVIEW: return {
      ...state,
      imageFiles: action.payload
    }
    case SET_INGREDIENTS: return {
      ...state,
      ingredients: action.payload
    }
    case SET_CATEGORY: return {
      ...state,
      filterCategory: action.payload
    }
    case SET_CUSTOM_FORM: return {
      ...state,
      fields: action.payload
    }
    case SET_VALID_PRODUCT: return {
      ...state,
      valid: action.payload
    }
    case SET_LISTING_DETAILS: return {
      ...state,
      name: action.payload.name,
      description: action.payload.description,
      category: action.payload.category,
      processingTime: action.payload.processingTime,
      automaticRenewal: action.payload.automaticRenewal
    }
    case SET_PRICING_INVENTORY: return {
      ...state,
      varieties: action.payload.varieties,
      inventory: action.payload.inventory
    }
    case SET_PRODUCT_WEIGHT: return {
      ...state,
      weight: action.payload
    }
    case SET_ADDONS: return {
      ...state,
      addons: action.payload
    }
    case SET_PERSONALIZATIONS: return {
      ...state,
      personalizationPrompt: action.payload
    }
    case CREATE_PRODUCT_REQUEST: return {
      ...state,
      loading: true
    }
    case CREATE_PRODUCT_SUCCESS: return {
      ...state,
      loading: false,
      error: ''
    }
    case CREATE_PRODUCT_FAILURE: return {
      ...state,
      loading: false,
      error: action.payload
    }
    case GET_PRODUCTS_REQUEST: return {
      ...state,
      loading: true
    }
    case GET_PRODUCTS_SUCCESS: return {
      ...state,
      loading: false,
      products: action.payload,
      error: ''
    }
    case GET_PRODUCTS_FAILURE: return {
      ...state,
      products: [],
      error: action.payload,
      loading: false
    }
    case GET_PRODUCTS_COUNT_REQUEST: return {
      ...state,
      loading: true
    }
    case GET_PRODUCTS_COUNT_SUCCESS: return {
      ...state,
      loading: false,
      count: action.payload,
      error: ''
    }
    case GET_PRODUCTS_COUNT_FAILURE: return {
      ...state,
      count: 0,
      error: action.payload
    }
    case SET_PRODUCT_EDIT:
      return {
        ...state,
        id: action.payload.id,
        custom: action.payload.custom,
        name: action.payload.name,
        description: action.payload.description,
        category: action.payload.category,
        processingTime: action.payload.processingTime,
        automaticRenewal: action.payload.automaticRenewal,
        ingredients: action.payload.ingredients,
        varieties: action.payload.varieties,
        inventory: action.payload.inventory,
        addons: action.payload.addons,
        fields: action.payload.fields,
        personalizationPrompt: action.payload.personalizationPrompt,
        productImages: action.payload.productImages,
        weight: action.payload.weight,
        published: action.payload.published
      }
    case EDIT_PRODUCT_REQUEST: return {
      ...state,
      loading: true,
      error: ''
    }
    case EDIT_PRODUCT_SUCCESS: return {
      ...state,
      id: action.payload.id,
      custom: action.payload.custom,
      name: action.payload.name,
      description: action.payload.description,
      category: action.payload.category,
      processingTime: action.payload.processingTime,
      automaticRenewal: action.payload.automaticRenewal,
      ingredients: action.payload.ingredients,
      varieties: action.payload.Varieties,
      addons: action.payload.Addons,
      personalizationPrompt: action.payload.personalizationPrompt,
      productImages: action.payload.ProductImages,
      inventory: action.payload.inventory,
      loading: false,
      error: ''
    }
    case EDIT_PRODUCT_FAILURE: return {
      ...state,
      loading: false,
      error: action.payload
    }
    case RESET_PRODUCT: return {
      ...state,
      id: 0,
      custom: action.payload.custom,
      name: '',
      description: '',
      category: '',
      processingTime: 1,
      automaticRenewal: true,
      ingredients: [],
      varieties: [],
      addons: [],
      fields: [],
      personalizationPrompt: '',
      inventory: 0,
      imageFiles: [],
      productImages: [],
      loading: false
    }
    default: return state
  }
}

export default productReducer
