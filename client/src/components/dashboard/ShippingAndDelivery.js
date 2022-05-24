import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/material/styles';
import { GoogleMap, LoadScript, Circle } from '@react-google-maps/api';
import { Input, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
      flexGrow: 1,
  },
  addressField: {
    width: '100%'
  },
  pickupAddress: {
    width: '100%',
    alignSelf: 'stretch'
  },
  flexGrow: {
    flex: 1
  }
}));

function ShippingAndDelivery(props) {
  const classes = useStyles();
  const [circle, setCircle] = useState('')
  const [location, setLocation] = useState(props.shop.area.location)
  const [street, setStreet] = useState(props.shop.pickupAddress.street)
  const [city, setCity] = useState(props.shop.pickupAddress.city)
  const [state, setState] = useState('FL')
  const [zipcode, setZipcode] = useState(props.shop.pickupAddress.zipcode)
  const [pickup, setPickup] = useState(street ? true : false)

  const containerStyle = {
    width: '290px',
    height: '290px'
  };

  const circleOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable:false,
    editable: true,
    visible: true,
    radius: props.shop.area.radius,
    zIndex: 1
  }

  const handleMapSave = (() => {
    if(circle) {
      props.setDeliveryArea({
        radius: circle.radius,
        lat: circle.center.lat(),
        lng: circle.center.lng(),
        location: location,
      })
    }
  })

  const handleButtonClick = (e) => {
    props.getLatLngFromAddress(location)
  }

  useEffect(() => {
    props.setPickupAddress({
      street: street,
      city: city,
      state: 'FL',
      zipcode: zipcode,
      allowPickups: pickup
    })
  }, [pickup, street, city, zipcode])

  const handlePickupCheckboxChange = (event) => {
    setPickup(event.target.checked);
  };

  return (
    <Grid alignItems="center" container spacing={2} className={classes.root} direction="column">
      <Grid item xs={12} md={8}>
        <Typography>
          Enter the address of your home/kitchen. This should be the location at which customers can pickup orders (if you allow pickups). 
          It will not be published to customers until an order is confirmed and paid for. It will also be used in the calculation of "By the mile" 
          delivery fees for your products, should you choose that fee structure when creating a product. You can edit this in the future.
        </Typography>
      </Grid>
      <Grid spacing={1} container item xs={12} md={8}>
        <Grid item>
          <TextField
            className={classes.addressField}
            value={street}
            id="outlined"
            label="Street"
            variant="outlined"
            onChange={(e) => {setStreet(e.target.value)}}
          />
        </Grid>
        <Grid item>
          <TextField
            className={classes.addressField}
            value={city}
            id="outlined"
            label="City"
            variant="outlined"
            onChange={(e) => {setCity(e.target.value)}}
          />
        </Grid>
        <Grid item>
          <TextField
            className={classes.addressField}
            id="outlined"
            label="State"
            value='FL'
            disabled
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <TextField
            className={classes.addressField}
            value={zipcode}
            id="outlined"
            label="Zipcode"
            variant="outlined"
            onChange={(e) => {setZipcode(e.target.value)}}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>
          Would you like to offer a pickup option to your customers? You cannot charge a fee for pickups. 
          Delivery and shipping pricing are configurable upon creating a product.
          <Checkbox
            checked={pickup}
            onChange={handlePickupCheckboxChange}
            name="checked"
            color="primary"
          />
        </Typography>
      </Grid>
      <Grid item container style={{width: '300px'}}>
        <Grid item className={classes.flexGrow}>
          <TextField className={classes.addressField}
            placeholder="Enter a delivery area"
            value={location}
            onChange={(e) => {setLocation(e.target.value)}}
          />
        </Grid>
        <Grid item>
          <IconButton color="primary" size="medium" onClick={handleButtonClick}><SearchIcon /></IconButton>
        </Grid>
      </Grid>
      <Grid container item direction="column" alignContent="center">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{
            lat: props.shop.area.lat,
            lng: props.shop.area.lng
          }}
          zoom={10}
        >
          <Circle
          onLoad={circle => {setCircle(circle)}}
          center={{
            lat: props.shop.area.lat,
            lng: props.shop.area.lng
          }}
          options={circleOptions}
        />
        </GoogleMap>
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={() => {handleMapSave()}}
        >
          Save
        </Button>
      </Grid>
      <Grid item xs={12} md={6} lg={4} container justify="flex-end">
        
      </Grid>
    </Grid>
  );
}

export default React.memo(ShippingAndDelivery)