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
  EDIT_PRODUCT_REQUEST,
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_FAILURE,
  SET_PRODUCT_EDIT,
  RESET_PRODUCT,
  SET_CUSTOM_FORM
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

export const setCustomForm = (fields) => {
  return {
    type: SET_CUSTOM_FORM,
    payload: fields
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
  try {
    products.success = products.success.map(product => {
      if (product.Form) {
        return {
          ...product,
          fields: product.Form.Fields.map(field => {
            return {
              name: field.name,
              type: field.type,
              options: field.Options ? field.Options.map(option => option.name) : [],
              constraints: field.Constraints
                ? field.Constraints.map(constraint => {
                    return { [constraint.name]: constraint.value }
                  })
                : [],
              value: field.Value
                ? field.Value.value
                : (field.ParagraphValue ? field.ParagraphValue.value : '')
            }
          })
        }
      }
      return product
    })
    return {
      type: GET_PRODUCTS_SUCCESS,
      payload: products.success
    }
  } catch (e) {
    console.log(e)
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
  formData = {
    ...formData,
    product: {
      ...formData.product,
      fields: mapFields(formData.product.fields)
    }
  }
  console.log('before', formData)
  return async (dispatch) => {
    try {
      dispatch(createProductRequest)
      const res = await axios.post('/api/product/create', formData)
      if (res.data.error[0]) {
        dispatch(createProductFailure(res.data.error[0]))
      } else {
        dispatch(createProductSuccess(res.data))
        dispatch(getProducts({ shop: formData.shopId }))
      }
    } catch (error) {
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
      if (res.data.error[0]) {
        dispatch(getProductsFailure(res.data.error[0]))
      } else {
        dispatch(getProductsSuccess(res.data))
      }
    } catch (error) {
      dispatch(getProductsFailure(error.message))
    }
  }
}

// EDIT
export const editProductRequest = () => {
  return {
    type: EDIT_PRODUCT_REQUEST
  }
}

export const editProductSuccess = (product) => {
  return {
    type: EDIT_PRODUCT_SUCCESS,
    payload: product.success
  }
}

export const editProductFailure = (error) => {
  return {
    type: EDIT_PRODUCT_FAILURE,
    payload: error
  }
}

export const resetProduct = () => {
  return {
    type: RESET_PRODUCT
  }
}

export const editProduct = (formData) => {
  formData = {
    ...formData,
    product: {
      ...formData.product,
      fields: mapFields(formData.product.fields)
    }
  }
  console.log('before edit', formData)
  return async (dispatch) => {
    try {
      dispatch(editProductRequest)
      const res = await axios.post('/api/product/update', formData)
      if (res.data.error[0]) {
        dispatch(editProductFailure(res.data.error[0]))
      } else {
        console.log(res.data)
        dispatch(editProductSuccess(res.data))
      }
    } catch (error) {
      dispatch(editProductFailure(error.message))
    }
  }
}

const mapFields = (fields) => {
  fields.map((field) => {
    let mappedField = {
      name: field.name,
      prompt: field.prompt,
      type: field.type,
      Options: field.options.map(option => {
        return { name: option }
      }),
      Constraints: Object.entries(field.constraints).map((key, value) => {
        return {
          name: key,
          value: value
        }
      }),
      Value: { value: field.value }
    }

    if (mappedField.type === 'paragraph') {
      mappedField = {
        ...mappedField,
        ParagraphValue: mappedField.Value
      }

      delete mappedField.Value
    }

    return mappedField
  })
  return fields
}
