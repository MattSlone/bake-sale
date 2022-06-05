require('dotenv').config()
const db = require('../models/index')
const fetch = require('node-fetch')

module.exports = class GMaps {
  static async haversine_distance(mk1, mk2) {
    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = mk1.lat * (Math.PI/180); // Convert degrees to radians
    var rlat2 = mk2.lat * (Math.PI/180); // Convert degrees to radians
    var difflat = rlat2-rlat1; // Radian difference (latitudes)
    var difflon = (mk2.lng-mk1.lng) * (Math.PI/180); // Radian difference (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    const d_meters = d * (1/0.000621371)
    console.log("METERS: ", d_meters)
    return d_meters;
  }

  static async getLatLng(user) {
    const address = `${user.street} ${user.city}, ${user.state} ${user.zipcode}`
    const url =`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GMAPS_KEY}`
    const response = await fetch(url)
    const data = await response.json();
    const latLng = data.results[0]?.geometry?.location
    console.log('latLng: ', url)
    return latLng
  }
}
