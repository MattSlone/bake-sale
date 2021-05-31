import axios from 'axios'

import {
  SET_PRODUCT_IMAGES_PREVIEW,
  SET_INGREDIENTS,
  SET_LISTING_DETAILS,
  SET_PRICING_INVENTORY,
  SET_ADDONS,
  SET_PERSONALIZATIONS,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  SET_PRODUCT_EDIT
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

export const setAddons = (addons) => {
  return {
    type: SET_ADDONS,
    payload: addons
  }
}

export const setPersonalizationPrompt = (personalizationPrompt) => {
  return {
    type: SET_PERSONALIZATIONS,
    payload: personalizationPrompt
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

export const getProductsRequest = () => {
  return {
    type: GET_PRODUCTS_REQUEST
  }
}

export const getProductsSuccess = (products) => {
  return {
    type: GET_PRODUCTS_SUCCESS,
    payload: products.success
  }
}

export const getProductsFailure = (error) => {
  return {
    type: GET_PRODUCTS_FAILURE,
    payload: error
  }
}

export const setProductEdit = (product) => {
  return {
    type: SET_PRODUCT_EDIT,
    payload: product
  }
}

export const createProduct = (formData) => {
  console.log('createprod', formData)
  return async (dispatch) => {
    try {
      dispatch(createProductRequest)
      const res = await axios.post('/api/product/create', formData)
      if(res.data.error[0]) {
        dispatch(createProductFailure(res.data.error[0]))
      }
      else {
        dispatch(createProductSuccess(res.data))
        dispatch(getProducts({shop: formData.shopId}))
      }
    } catch(error) {
      dispatch(createProductFailure(error.message))
    }
  }
}

export const getProducts = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(getProductsRequest)
      const res = await axios.get('/api/products', {
        params: formData
      })
      if(res.data.error[0]) {
        dispatch(getProductsFailure(res.data.error[0]))
      }
      else {
        dispatch(getProductsSuccess(res.data))
      }
    } catch(error) {
      dispatch(getProductsFailure(error.message))
    }
  }
}
