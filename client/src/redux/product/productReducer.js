import {
  SET_PRODUCT_IMAGES_PREVIEW
} from './productTypes'

const initialState = {
  imageFiles: [],
}

const productReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_PRODUCT_IMAGES_PREVIEW: return {
      ...state,
      imageFiles: action.payload,
    }
    default: return state
  }
}

export default productReducer
