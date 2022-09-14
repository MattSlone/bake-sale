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
  GET_PRODUCTS_COUNT_REQUEST,
  GET_PRODUCTS_COUNT_SUCCESS,
  GET_PRODUCTS_COUNT_FAILURE,
  EDIT_PRODUCT_REQUEST,
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_FAILURE,
  SET_PRODUCT_EDIT,
  RESET_PRODUCT,
  SET_CUSTOM_FORM,
  SET_PRODUCT_WEIGHT,
  SET_VALID_PRODUCT,
  SET_CATEGORY
} from './productTypes'

export const setProductImagesPreview = (files) => {
  console.log(files[files.length-1])
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

export const setValidProduct = (valid) => {
  return {
    type: SET_VALID_PRODUCT,
    payload: valid
  }
}

export const setCategory = (category) => {
  return {
    type: SET_CATEGORY,
    payload: category
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
              id: field.id,
              name: field.name,
              type: field.type,
              options: field.Options ? field.Options.map(option => option.name) : [],
              constraints: field.Constraints ?
                field.Constraints.reduce(
                  (prev, curr) => ({ ...prev, [curr.name]: curr.value}), {}
                )
              : [],
              value: field.Value
                ? field.Value.value
                : (field.ParagraphValue ? field.ParagraphValue.value : ''),
              deleted: field.deleted
            }
          })
        }
      }
      console.log(product)
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

export const getProductsCountRequest = () => {
  return {
    type: GET_PRODUCTS_COUNT_REQUEST
  }
}

export const getProductsCountSuccess = (count) => {
  return {
    type: GET_PRODUCTS_COUNT_SUCCESS,
    payload: count
  }
}

export const getProductsCountFailure = (error) => {
  return {
    type: GET_PRODUCTS_COUNT_FAILURE,
    payload: error
  }
}

export const setProductEdit = (product) => {
  return {
    type: SET_PRODUCT_EDIT,
    payload: product
  }
}

export const setProductWeight = (weight) => {
  return {
    type: SET_PRODUCT_WEIGHT,
    payload: weight
  }
}

export const createProduct = (formData) => {
  const imageFormData = formData.imageFormData
  delete formData.imageFormData
  formData = {
    ...formData,
    product: {
      ...formData.product,
      fields: mapFields(formData.product.fields)
    }
  }
  return async (dispatch) => {
    try {
      dispatch(createProductRequest())
      const res = await axios.post('/api/product/create', formData)
      if (res.data?.success?.id) {
        imageFormData.append('productId', res.data.success.id)
        const res2 = await axios.post('/api/product/images', imageFormData)
      }
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
      dispatch(getProductsRequest())
      const res = await axios.get('/api/products', {
        params: formData
      })
      if (res.data.error) {
        dispatch(getProductsFailure(res.data.error))
      } else {
        dispatch(getProductsSuccess(res.data))
      }
    } catch (error) {
      dispatch(getProductsFailure(error.message))
    }
  }
}

export const getProductsCount = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(getProductsCountRequest())
      const res = await axios.get('/api/products/count', {
        params: formData
      })
      if (res.data.error[0]) {
        dispatch(getProductsCountFailure(res.data.error[0]))
      } else {
        dispatch(getProductsCountSuccess(res.data.success))
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

export const resetProduct = (custom = false) => {
  return {
    type: RESET_PRODUCT,
    payload: custom
  }
}

export const editProduct = (formData) => {
  const imageFormData = formData.imageFormData
  formData = {
    ...formData,
    product: {
      ...formData.product,
      fields: mapFields(formData.product.fields)
    }
  }
  return async (dispatch) => {
    try {
      dispatch(editProductRequest())
      imageFormData.append('productId', formData.product.id)
      const imageRes = await axios.post('/api/product/images', imageFormData)
      const res = await axios.post('/api/product/update', formData)
      if (res.data.error && res.data.error[0]) {
        dispatch(editProductFailure(res.data.error[0]))
      } else if (imageRes.data.error) {
        dispatch(editProductFailure(imageRes.data.error[0]))
      } else {
        dispatch(editProductSuccess(res.data))
      }
    } catch (error) {
      dispatch(editProductFailure(error.message))
    }
  }
}

const mapFields = (fields) => {
  fields = fields.map((field) => {
    let mappedField = {
      name: field.name,
      prompt: field.prompt,
      type: field.type,
      deleted: field.deleted,
      Options: field.options.map(option => {
        return { name: option }
      }),
      Constraints: Object.entries(field.constraints).map(constraint => {
        return {
          name: constraint[0],
          value: constraint[1]
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
