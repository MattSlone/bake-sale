import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import { Input, TextField, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { useRouteMatch, useParams } from "react-router-dom";
import { GoogleMap, LoadScript, Circle } from '@react-google-maps/api';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { setContact } from '../../redux';


const PREFIX = 'PickupAndDeliveryOptions';

const classes = {
  root: `${PREFIX}-root`,
  desktop: `${PREFIX}-desktop`,
  mobile: `${PREFIX}-mobile`,
  button: `${PREFIX}-button`,
  actionsContainer: `${PREFIX}-actionsContainer`,
  resetContainer: `${PREFIX}-resetContainer`,
  fullWidth: `${PREFIX}-fullWidth`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    maxWidth: '100%',
  },

  [`& .${classes.desktop}`]: {
    padding: theme.spacing(2)
  },

  [`& .${classes.mobile}`]: {
    paddingTop: useRouteMatch().path.includes('add') ? theme.spacing(7) : theme.spacing(0),
    paddingLeft: 0,
    paddingRight: 0
  },

  [`& .${classes.button}`]: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },

  [`& .${classes.actionsContainer}`]: {
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.resetContainer}`]: {
    padding: theme.spacing(3),
  },

  [`& .${classes.fullWidth}`]: {
    width: '100%'
  }
}));

function getSteps() {
  return ['Set your address',
          'Configure pickup options',
          'Configure contact options',
          'Determine delivery area'
        ];
}

export default function PickupAndDeliveryOptions(props) {

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const match = useRouteMatch()

  const [circle, setCircle] = useState('')
  const [location, setLocation] = useState(props.shop.area.location)
  const [street, setStreet] = useState(props.shop.pickupAddress.street)
  const [city, setCity] = useState(props.shop.pickupAddress.city)
  const [zipcode, setZipcode] = useState(props.shop.pickupAddress.zipcode)
  const [pickup, setPickup] = useState(props.shop.allowPickups)
  const [contactType, setContactType] = useState('none')
  const [phone, setPhone] = useState(props.shop.contact.phone)
  const [email, setEmail] = useState(props.shop.contact.email)

  const [pickupSchedule, setPickupSchedule] = useState(props.shop.pickupSchedule);

  const [pickupScheduleChecked, setPickupScheduleChecked] = useState({
    Monday: Boolean(pickupSchedule.find(day => day.day == 'Monday' && day.start !== day.end)),
    Tuesday: Boolean(pickupSchedule.find(day => day.day == 'Tuesday' && day.start !== day.end)),
    Wednesday: Boolean(pickupSchedule.find(day => day.day == 'Wednesday' && day.start !== day.end)),
    Thursday: Boolean(pickupSchedule.find(day => day.day == 'Thursday' && day.start !== day.end)),
    Friday: Boolean(pickupSchedule.find(day => day.day == 'Friday' && day.start !== day.end)),
    Saturday: Boolean(pickupSchedule.find(day => day.day == 'Saturday' && day.start !== day.end)),
    Sunday: Boolean(pickupSchedule.find(day => day.day == 'Sunday' && day.start !== day.end))
  })

  useEffect(() => {
    props.setPickupAddress({
      ...props.shop.pickupAddress,
      street: street,
      city: city,
      state: 'FL',
      zipcode: zipcode,
      allowPickups: pickup
    })
  }, [pickup, street, city, zipcode])

  useEffect(() => {
    props.setPickupSchedule(pickupSchedule)
  }, [pickupSchedule])

  useEffect(() => {
    props.setContact({
      ...props.shop.contact,
      phone: phone,
      email: email
    })
  }, [phone, email])

  useEffect(() => {
    if (phone && email) {
      setContactType('both')
    } else if (phone) {
      setContactType('phone')
    } else if (email) {
      setContactType('email')
    } else {
      setContactType('none')
    }
  }, [])

  const handlePickupScheduleCheckedChange = (event) => {
    setPickupScheduleChecked({ ...pickupScheduleChecked, [event.target.name]: event.target.checked});
  };

  const handlePickupDayTimeChange = (event, index, type) => {
    let newPickupSchedule = [...pickupSchedule]

    newPickupSchedule[index] = {
      ...newPickupSchedule[index],
      [type]: event.target.value
    }

    setPickupSchedule(newPickupSchedule);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const matches = useMediaQuery('(min-width:600px)');

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

  const handlePickupCheckboxChange = (event) => {
    setPickup(event.target.checked);
  };

  const handleSelectContactType = (event) => {
    let type = event.target.value
    setContactType(type);

    if (type == 'phone') {
      setEmail('');
    } else if (type == 'email') {
      setPhone('');
    } else if (type == 'none') {
      setPhone('');
      setEmail('');
    }
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <Root className={classes.root}>
      <Stepper classes={matches ? {root: classes.desktop} : {root: classes.mobile}} activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
            {(() => {
              switch (activeStep) {
                case 0: return (
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
                  </Grid>
                )
                case 1:
                  return (
                    <Grid alignItems="center" container spacing={2} className={classes.root} direction="column">
                      <Grid item xs={12} md={8}>
                        <Typography>
                        You can offer a pickup option to your customers. You cannot charge a fee for pickups. 
                        If you choose to allow pickups, you have the option of selecting days and times at which 
                        orders can be picked up at your home/kitchen address. These can be changed in the future. Pickup window for 
                        a specific order is determined by your pickup schedule and the processing time you set when creating a product.
                        If you choose to forego having a predetermined pickup schedule, please supply a means of communication in 
                        the next step to allow coordination of pickups upon a customer placing an order. 
                        Delivery and shipping pricing are configurable when creating a product.
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Typography>
                          Allow Pickups
                          <Checkbox
                            checked={pickup}
                            onChange={handlePickupCheckboxChange}
                            name="checked"
                            color="primary"
                          />
                        </Typography>
                      </Grid>
                      <Grid spacing={1}  container alignItems="center" item>
                        {pickupSchedule.map((pickupDay, i) => (
                          <Grid key={i} container justifyContent="center" item sm={6} md={3}>
                            <Grid item>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={pickupScheduleChecked[pickupDay.day]}
                                    onChange={handlePickupScheduleCheckedChange}
                                    name={pickupDay.day}
                                    color="primary"
                                  />
                                }
                                label={pickupDay.day}
                                disabled={!pickup}
                              />
                            </Grid>
                            <Grid container item xs={12} justifyContent="center">
                              <Grid item>
                                <TextField
                                  label="Start Time"
                                  type="time"
                                  className={classes.textField}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  inputProps={{
                                    step: 300, // 5 min
                                  }}
                                  value={pickupDay.start}
                                  onChange={(e) => {handlePickupDayTimeChange(e, i, 'start')}}
                                  disabled={!pickupScheduleChecked[pickupDay.day]}
                                />
                              </Grid>
                              <Grid item>
                                <TextField
                                  label={"End Time"}
                                  type="time"
                                  className={classes.textField}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  inputProps={{
                                    step: 300, // 5 min
                                  }}
                                  value={pickupDay.end}
                                  onChange={(e) => {handlePickupDayTimeChange(e, i, 'end')}}
                                  disabled={!pickupScheduleChecked[pickupDay.day]}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  );
                case 2:
                  return (
                    <Grid container spacing={2} className={classes.root} direction="column">
                      <Grid item xs={12} md={8}>
                        <Typography>
                          Providing a way for your customers to contact you will allow for easier pickups and deliveries. You must provide a 
                          contact option if you do not have a pickup schedule. You can provide a phone number, email address, or both. 
                          Your contact option will not be published until a customer makes an order.
                        </Typography>
                      </Grid>
                      <Grid item container spacing={1} xs={12} md={8}>
                        <Grid item>
                          <FormControl variant="outlined" className={classes.fullWidth}>
                            <InputLabel id="contact-type-label">Contact Option</InputLabel>
                            <Select
                              labelId="contact-type-label"
                              id="variation-select"
                              label="Contact Type"
                              value={contactType}
                              onChange={handleSelectContactType}
                            >
                              <MenuItem value={'none'}>None</MenuItem> 
                              <MenuItem value={'phone'}>Phone</MenuItem> 
                              <MenuItem value={'email'}>Email</MenuItem> 
                              <MenuItem value={'both'}>Both</MenuItem> 
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <TextField
                            className={classes.fullWidth}
                            value={phone}
                            id="outlined"
                            label="Phone"
                            variant="outlined"
                            onChange={handlePhoneChange}
                            disabled={contactType === 'none' || contactType === 'email'}
                          />
                        </Grid>
                        <Grid item>
                          <TextField
                            className={classes.fullWidth}
                            value={email}
                            id="outlined"
                            label="Email"
                            variant="outlined"
                            onChange={handleEmailChange}
                            disabled={contactType === 'none' || contactType === 'phone'}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  )
                case 3:
                  return (
                    <Grid container  spacing={2} className={classes.root}>
                      <Grid item xs={12} md={6} >
                        <Grid container direction="column" spacing={2}>
                          <Grid item>
                            <Typography>
                              Choose a delivery area. If you offer a product for delivery, only customers whose addresses are within your 
                              delivery area will be able to purchase the product (customers will still be able to pickup the item or choose shipping if 
                              offered).
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography>
                              Above the map to the right, you can search for a location or address in the search box, and 
                              the map will move to this location. You can then further adjust your search area by moving the circle and adjusting its 
                              size. Be sure to click the save button below the map to finalize your delivery area.
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Grid container direction="column">
                          <Grid item container>
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
                          <Grid container alignItems="center" item direction="column">
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
                              className={classes.fullWidth}
                              variant="contained"
                              size="large"
                              color="primary"
                              onClick={() => {handleMapSave()}}
                            >
                              Save
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid> 
                    </Grid>
                  )
                default:
                  return 'Unknown step';
              }
            })()}
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  {(() => {
                    if (activeStep === steps.length - 1) {
                      return ''
                    } else {
                      return <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
                      >
                        Next
                      </Button>
                    }
                  })()}
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </Root>
  );
}
