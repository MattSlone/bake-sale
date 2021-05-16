import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { GoogleMap, LoadScript, Circle } from '@react-google-maps/api';
import { Input, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
      flexGrow: 1,
  },
  addressField: {
    width: '100%'
  },
  flexGrow: {
    flex: 1
  }
}));

function ShippingAndDelivery(props) {
  const classes = useStyles();
  const [circle, setCircle] = useState('')
  const [address, setAddress] = useState('')

  const containerStyle = {
    width: '400px',
    height: '400px'
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
    radius: props.area.radius,
    zIndex: 1
  }

  const handleMapSave = (() => {
    if(circle) {
      props.setDeliveryArea({
        radius: circle.radius,
        lat: circle.center.lat(),
        lng: circle.center.lng(),
        address: address
      })
    }
  })

  const handleButtonClick = (e) => {
    props.getLatLngFromAddress(address)
  }

  return (
    <Grid container spacing={2} className={classes.root} direction="column">
      <Grid item xs={12} md={5}>
        <Grid container>
          <Grid item className={classes.flexGrow}>
            < TextField className={classes.addressField}
              placeholder="Enter Your Home Address"
              onChange={(e) => {setAddress(e.target.value)}}
            />
          </Grid>
          <Grid item>
          <IconButton color="primary" size="medium" onClick={handleButtonClick}><SearchIcon /></IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{
            lat: props.area.lat,
            lng: props.area.lng
          }}
          zoom={10}
        >
          <Circle
          onLoad={circle => {setCircle(circle)}}
          center={{
            lat: props.area.lat,
            lng: props.area.lng
          }}
          options={circleOptions}
        />
        </GoogleMap>
      </Grid>
      <Grid container justify="flex-end">
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={() => {handleMapSave()}}
        >
          Save
        </Button>
      </Grid>
    </Grid>
  );
}

export default React.memo(ShippingAndDelivery)