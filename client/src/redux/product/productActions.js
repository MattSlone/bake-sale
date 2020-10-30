import {
  SET_PRODUCT_IMAGES_PREVIEW
} from './productTypes'

export const setProductImagesPreview = (files) => {
  return {
    type: SET_PRODUCT_IMAGES_PREVIEW,
    payload: files
  }
}
