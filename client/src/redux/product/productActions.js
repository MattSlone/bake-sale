import axios from 'axios'

import {
  SET_PRODUCT_IMAGES_PREVIEW,
  SET_INGREDIENTS,
  SET_LISTING_DETAILS,
  SET_PRICING_INVENTORY,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE
} from './productTypes'

export const setProductImagesPreview = (files) => {
  return {
    type: SET_PRODUCT_IMAGES_PREVIEW,
    payload: files
  }
}

export const setIngredients = (ingredients) => {
  return {
    type: SET_INGREDIENTS,
    payload: ingredients
  }
}

export const setListingDetails = (listingDetails) => {
  return {
    type: SET_LISTING_DETAILS,
    payload: listingDetails
  }
}

export const setPricingAndInventory = (pricingAndInventory) => {
  return {
    type: SET_PRICING_INVENTORY,
    payload: pricingAndInventory
  }
}

// CREATE
export const createProductRequest = () => {
  return {
    type: CREATE_PRODUCT_REQUEST
  }
}

export const createProductSuccess = (product) => {
  return {
    type: CREATE_PRODUCT_SUCCESS,
    payload: product
  }
}

export const createProductFailure = (error) => {
  return {
    type: CREATE_PRODUCT_FAILURE,
    payload: error
  }
}

export const createProduct = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(createProductRequest)
      const res = await axios.post('/api/product/create', formData)
      if(res.data.error[0]) {
        dispatch(createProductFailure(res.data.error[0]))
      }
      else {
        dispatch(createProductSuccess(res.data))
      }
    } catch(error) {
      dispatch(createProductFailure(error.message))
    }
  }
}
