require('dotenv').config()
const db = require('../models/index')
const fetch = require('node-fetch')
const axios = require('axios') // i forgot how fetch works and im lazy don't judge me
const env = require('../config/environment')

const MILES_MULTIPLE = 0.000621371

module.exports = class GMaps {
  static haversine_distance(mk1, mk2) {
    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = mk1.lat * (Math.PI/180); // Convert degrees to radians
    var rlat2 = mk2.lat * (Math.PI/180); // Convert degrees to radians
    var difflat = rlat2-rlat1; // Radian difference (latitudes)
    var difflon = (mk2.lng-mk1.lng) * (Math.PI/180); // Radian difference (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    const d_meters = d * (1/MILES_MULTIPLE)
    console.log(d_meters)
    return d_meters;
  }

  static convertMetersToMiles(meters) {
    return (meters * MILES_MULTIPLE)
  }

  static convertMilesToMeters(miles) {
    return (miles / MILES_MULTIPLE)
  }

  /*static async getFormattedAddress({ street, city, state, zipcode }) {
    try {
      const address = `${street} ${city}, ${state} ${zipcode}`
      console.log('ADDRESS: ', address)
      const params = {
        query: address,
        access_key: env.positionStackAPIKey,
      }
      const res = await axios.get(`http://api.positionstack.com/v1/forward`, { params })
      if(res.error) {
        return res.error.message
      }
      if(res.data.error) {
        return res.data.error.message
      }
      else {
        console.log(res.data)
        if (res.data.data[0]?.type !== 'address') {
          return "Invalid Address."
        }
        return res.data.data[0]
      }
    } catch (error) {
      if (error.response) {
        return error.response.statusText
      }
      return error
    }
  } */

  static async getFormattedAddress({ street, city, state, zipcode }) {
    try {
      const address = `${street} ${city}, ${state} ${zipcode}`
      console.log('ADDRESS: ', address)
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${env.gmapsKey}`
      )
      console.log(res)
      if(res.error_message) {
        return res.error_message
      } else if (res.data.status != "OK") {
        return "There was an issue validating your address."
      }
      else {
        const addressComponents = this.convertFormattedAddressToObject(
          res.data.results[0]
        )
        if (typeof addressComponents == 'string') {
          return addressComponents
        }
        return {
          ...addressComponents,
          street: `${addressComponents.street_number} ${addressComponents.route}`,
          city: addressComponents.locality,
          state: addressComponents.administrative_area_level_1,
          zipcode: addressComponents.postal_code,
          latitude: addressComponents.lat,
          longitude: addressComponents.lng,
        }
      }
    } catch (error) {
      console.log('GET FORMATTED ADDRESS ERROR: ', error, '\nEND ERROR\n')
      if (error.response) {
        return error.response.statusText
      }
      return error
    }
  }

  /**
   * For Google Maps GeoCoding API if ever decide to use again
  **/
  static convertFormattedAddressToObject(data) {
    const addressComponents = Object.fromEntries(data.address_components.filter(
      component => {
        // these tyes are wrong, they were right at some point tho...
        const types = component.types.filter(type => [
          'street_number',
          'route',
          'locality',
          'administrative_area_level_1',
          'postal_code'].includes(type))
          return types.length > 0
      }
    ).map(component => [component.types[0], component.long_name]))
    if (Object.keys(addressComponents).length < 5) {
      return "There was an issue validating your address."
    }
    return {
      ...addressComponents,
      ...data.geometry.location
    }  
  }
}


