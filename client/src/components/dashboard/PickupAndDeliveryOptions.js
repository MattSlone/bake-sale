import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import { TextField, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { useRouteMatch } from "react-router-dom";
import { GoogleMap, Circle } from '@react-google-maps/api';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import axios from 'axios'
import ReCAPTCHA from "react-google-recaptcha";
import { useIsMount } from '../../hooks/useIsMount';

const PREFIX = 'PickupAndDeliveryOptions';

const classes = {
  root: `${PREFIX}-root`,
  desktop: `${PREFIX}-desktop`,
  mobile: `${PREFIX}-mobile`,
  button: `${PREFIX}-button`,
  actionsContainer: `${PREFIX}-actionsContainer`,
  resetContainer: `${PREFIX}-resetContainer`,
  fullWidth: `${PREFIX}-fullWidth`,
  stepLabel: `${PREFIX}-stepLabel`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  maxWidth: '100%',

  [`& .${classes.radiusInput}`]: {
    margin: "0.5em 0",
    width: '100%'
  },

  [`& .${classes.stepLabel}`]: {
    cursor: 'pointer',
    pointerEvents: 'all !important'
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
  return {
    address: 'Set your address',
    pickups: 'Configure pickup options',
    contact: 'Configure contact options',
    delivery: 'Determine delivery area'
  }
}

export default function PickupAndDeliveryOptions(props) {
  let recaptcha
  const [activeStep, setActiveStep] = React.useState(0);
  const isMount = useIsMount()
  const steps = getSteps();
  const match = useRouteMatch()
  const edit = match.path.includes('edit')
  const [circle, setCircle] = useState('')
  const [street, setStreet] = useState(props.shop.pickupAddress.street)
  const [street2, setStreet2] = useState(props.shop.pickupAddress.street2)
  const [city, setCity] = useState(props.shop.pickupAddress.city)
  const [state, setState] = useState(props.shop.pickupAddress.state)
  const [zipcode, setZipcode] = useState(props.shop.pickupAddress.zipcode)
  const [pickup, setPickup] = useState(props.shop.allowPickups)
  const [contactType, setContactType] = useState('none')
  const [phone, setPhone] = useState(props.shop.contact.phone)
  const [email, setEmail] = useState(props.shop.contact.email)
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')
  const [pickupSchedule, setPickupSchedule] = useState(props.shop.pickupSchedule);
  const [pickupScheduleChecked, setPickupScheduleChecked] = useState({
    Monday: Boolean(pickupSchedule.find(window => window.day == 'Monday' && window.start !== window.end)),
    Tuesday: Boolean(pickupSchedule.find(window => window.day == 'Tuesday' && window.start !== window.end)),
    Wednesday: Boolean(pickupSchedule.find(window => window.day == 'Wednesday' && window.start !== window.end)),
    Thursday: Boolean(pickupSchedule.find(window => window.day == 'Thursday' && window.start !== window.end)),
    Friday: Boolean(pickupSchedule.find(window => window.day == 'Friday' && window.start !== window.end)),
    Saturday: Boolean(pickupSchedule.find(window => window.day == 'Saturday' && window.start !== window.end)),
    Sunday: Boolean(pickupSchedule.find(window => window.day == 'Sunday' && window.start !== window.end))
  })
  const [radius, setRadius] = useState(props.shop.pickupAddress.radius)
  const [validAddress, setValidAddress] = useState(edit ? {valid: true} : {valid: false})
  const [validPickupSchedule, setValidPickupSchedule] = useState(edit ? {valid: true} : {valid: false})
  const [validShopContact, setValidShopContact] = useState(edit ? {valid: true} : {valid: false})
  const [validDeliveryArea, setValidDeliveryArea] = useState(edit ? {valid: true} : {valid: false})
  const [goNext, setGoNext] = useState(false)

  useEffect(() => {
    if ([
      validAddress,
      validPickupSchedule,
      validShopContact,
      validDeliveryArea
    ].every(validator => validator.valid == true)) {
      props.setValidPickupAndDelivery(true)
    }
  }, [validAddress, validPickupSchedule, validShopContact, validDeliveryArea])

  function onChange(value) {
    setToken(value);
  }

  const validateAddressFields = () => {
    let rtn = {
      error: '',
      success: false
    }
    for (const field of [
      { name: 'Street', value: street },
      { name: 'City', value: city },
      { name: 'State', value: state },
      { name: 'Zipcode', value: zipcode },
      { name: 'ReCaptcha', value: token }
    ]) {
      if (!field.value) {
        rtn.error = `${field.name} is required.`
        return rtn
      }
    }
    rtn.success = true
    return rtn
  }

  const validatePickupSchedule = () => {
    /*
    pickupSchedule: [
      {day: 'Sunday', start: "12:00", end: "12:00"},
      ...
    ]
    */
    let rtn = {
      error: '',
      success: false
    }
    if (pickup && Object.keys(pickupScheduleChecked).filter((day) => {
      if (pickupScheduleChecked[day]) {
        const window = pickupSchedule.find(window => window.day == day)
        return window && window.start != window.end
      }
      return false
    }).length == 0) {
      rtn.error = 'You must provide at least one window of time in a week if you allow pickups.'
      return rtn
    }
    rtn.success = true
    return rtn
  }

  const validateShopContact = () => {
    let rtn = {
      error: '',
      success: false
    }
    const fields = [
      ...[(contactType == 'email' || contactType == 'both') && { name: "Email", value: email }],
      ...[(contactType == 'phone' || contactType == 'both') && { name: "Phone", value: phone }]
    ].filter(field => field)
    for (const field of fields) {
      if (!field.value) {
        rtn.error = `${field.name} is required.`
        return rtn
      }
    }
    if (contactType == 'none' && pickup) {
      rtn.error = `A contact method must be provided if you allow pickups.`
      return rtn
    }
    if ((contactType == 'both' || contactType == 'phone') && !isMobilePhone(phone, "en-US")) {
      rtn.error = `Invalid phone number`
      return rtn
    }
    if (
      (contactType == 'both' || contactType == 'email')
      && !isEmail(email.replace(/\s/g, ""))
    ) {
      rtn.error = `Invalid Email.`
      return rtn
    }
    rtn.success = true
    return rtn
  }

  const getFormattedShopAddress = async (formData) => {
    let rtn = {
      error: '',
      success: false
    }
    try {
      props.getFormattedShopAddressRequest()
      const res = await axios.post('/api/user/address/components', formData)
      if(res.data.error) {
        rtn.error = res.data.error[0]
        props.getFormattedShopAddressFailure(rtn.error)
        return rtn
      }
      props.getFormattedShopAddressSuccess({
        ...res.data.success,
        street2: street2
      })
      rtn.success = true
      return rtn
    } catch(error) {
      if (error.response) {
        rtn.error = 'There was an issue validating shop address'
      }
      rtn.error = error
      return rtn
    }
  }

  const validateAddress = async () => {
    let rtn = {
      error: '',
      success: false
    }
    recaptcha.reset()
    let validFields = validateAddressFields()
    if (validFields.success) {
      let newValidAddress = await getFormattedShopAddress({
        street: street,
        city: city,
        state: 'Florida',
        zipcode: zipcode,
        token: token
      })
      if (!newValidAddress.success) {
        if (newValidAddress.error) {
          rtn.error = newValidAddress.error
        }
      } else {
        console.log('heree goood')
        setToken('')
        rtn.success = true
      }
    } else {
      rtn.error = validFields.error
    }
    return rtn
  }

  useEffect(() => {
    if (props.shop.loading) {
      setMessage('loading...')
    } else {
      setMessage('')
    }
  }, [props.shop.loading])

  const validate = async () => {
    try {
      setMessage('')
      props.setValidPickupAndDelivery(false)
      let valid = { error: '', success: false }
      switch (activeStep) {
        case 0:
          valid = await validateAddress()
          if (valid.success) {
            setValidAddress({valid: true})
          } else {
            setValidAddress({valid: false})
          }
          break
        case 1:
          valid = validatePickupSchedule()
          if (valid.success) {
            props.setPickupSchedule({
              schedule: pickupSchedule,
              allowPickups: pickup
            })
            setValidPickupSchedule({valid: true})
          } else {
            setValidPickupSchedule({valid: false})
          }
          break
        case 2:
          valid = validateShopContact()
          if (valid.success) {
            props.setContact({
              ...props.shop.contact,
              phone: phone,
              email: email,
              type: contactType
            })
            setValidShopContact({valid: true})
          } else {
            setValidShopContact({valid: false})
          }
          break
        case 3:
          valid = validateDeliveryArea()
          if (valid.success) {
            props.setDeliveryArea({
              radius: circle.radius,
              lat: circle.center.lat(),
              lng: circle.center.lng()
            })
            setValidDeliveryArea({valid: true})
          } else {
            setValidDeliveryArea({valid: false})
          }
          break
        default:
          valid = {error: '', success: false }
      }
      if (valid.success) {
        props.setReadyEditShop({ready: true})
        return true
      } else if (valid.error) {
        props.setReadyEditShop({ready: false})
        setMessage(valid.error)
      }
    } catch (err) {
      return false
    }
  }

  // Initialize some stuff
  useEffect(() => {
    setMessage('')
    props.setParentMessage('')
    props.setChildStepsLength(Object.keys(steps).length)
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
    if(!event.target.checked) {
      const tempPickupSchedule = pickupSchedule.map((window) => {
        if (window.day == event.target.name) {
          window.start = "12:00"
          window.end = "12:00"
          return window
        }
        return window
      })
      setPickupSchedule(tempPickupSchedule)
    }
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

  useEffect(() => {
    setActiveStep(props.childStep)
  }, [props.childStep])

  const handleNext = async () => {
    if (await validate()) {
      props.setChildStep((prevActiveStep) => prevActiveStep + 1)
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  };

  const handleBack = async () => {
    props.setChildStep((prevActiveStep) => prevActiveStep - 1)
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
    draggable: false,
    editable: false,
    visible: true,
    radius: radius,
    zIndex: 1
  }

  useEffect(() => {
    if (activeStep == 3) {
      validate()
    }
  }, [radius])

  const validateDeliveryArea = () => {
    console.log('validating delivery area...')
    let rtn = {
      error: '',
      success: false
    }
    if(circle) {
      if (!(radius >= 0)) {
        rtn.error = "Radius must be at least 0."
        return rtn
      }
    } else {
      rtn.error = "Map has not rendered."
      return rtn
    }
    rtn.success = true
    return rtn
  }

  const handlePickupCheckboxChange = (event) => {
    setPickup(event.target.checked)
  }

  const handleSelectContactType = (event) => {
    let type = event.target.value
    setContactType(type)
    if (type == 'phone') {
      setEmail('')
    } else if (type == 'email') {
      setPhone('')
    } else if (type == 'none') {
      setPhone('')
      setEmail('')
    }
  }

  const handlePhoneChange = (event) => {
    setPhone(event.target.value)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  useEffect(() => {
    setMessage('')
  }, [activeStep])

  const handleGoToStep = async (i) => {
    setActiveStep(i)
    props.setChildStep(i)
  }

  return (
    <Root className={classes.root}>
      <Stepper classes={matches ? {root: classes.desktop} : {root: classes.mobile}} activeStep={activeStep} orientation="vertical">
        {Object.values(steps).map((label, index) => (
          <Step key={label}>
            {edit ? 
              <StepLabel onClick={(e) => handleGoToStep(index)} className={classes.stepLabel}>{label}</StepLabel>
            :
              <StepLabel>{label}</StepLabel>
            }
            <StepContent>
            {(() => {
              switch (activeStep) {
                case 0: return (
                  <Grid alignItems="center" container spacing={2} className={classes.root} direction="column">
                    <Grid item xs={12} md={8}>
                      <Typography>
                        Enter the address of your home or kitchen. This should be the location at which customers can pickup orders (if you allow pickups). 
                        It will not be published to customers until an order is confirmed and paid for. It will also be used in the calculation of "By the mile" 
                        delivery fees for your products, should you choose that fee structure when creating a product. You can edit this in the future.
                      </Typography>
                    </Grid>
                    <Grid spacing={1} container item xs={12} md={8}>
                      <Grid item>
                        <TextField
                          className={classes.addressField}
                          value={street}
                          label="Street"
                          variant="outlined"
                          onChange={(e) => {setStreet(e.target.value)}}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          className={classes.addressField}
                          value={street2}
                          label="Apartment, suite, etc."
                          variant="outlined"
                          onChange={(e) => {setStreet2(e.target.value)}}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          className={classes.addressField}
                          value={city}
                          label="City"
                          variant="outlined"
                          onChange={(e) => {setCity(e.target.value)}}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          className={classes.addressField}
                          label="State"
                          value={state}
                          disabled
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          className={classes.addressField}
                          value={zipcode}
                          label="Zipcode"
                          variant="outlined"
                          onChange={(e) => {setZipcode(e.target.value)}}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ReCAPTCHA
                          ref={el => { recaptcha = el }}
                          sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                          onChange={onChange}
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
                              You can choose the delivery radius using the input under the map to the right.
                              You can zoom in on the map to see where the radius ends. The map saves automatically
                              so once you're done you can go to the next step.
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Grid container direction="column">
                          <Grid container alignItems="center" item direction="column">
                            <GoogleMap
                              mapContainerStyle={containerStyle}
                              center={{
                                lat: props.shop.pickupAddress.lat,
                                lng: props.shop.pickupAddress.lng
                              }}
                              zoom={10}
                            >
                              <Circle
                              onLoad={circle => {setCircle(circle)}}
                              center={{
                                lat: props.shop.pickupAddress.lat,
                                lng: props.shop.pickupAddress.lng
                              }}
                              options={circleOptions}
                            />
                            </GoogleMap>
                            <TextField
                              variant='outlined'
                              label="radius"
                              style={{width: '100%', marginTop: '0.5em'}}
                              inputProps={{min: 0, style: { textAlign: 'center' }}} 
                              type="number"
                              value={Number(radius)}
                              onChange={(e) => {setRadius(Number(e.target.value))}}
                            />
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
                <Typography style={{color: "red"}}>
                  {message}
                </Typography>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep !== Object.keys(steps).length - 1 ? (edit ? 'Save' : 'Next') : 'Finish'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {edit && activeStep === Object.keys(steps).length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>
            Shop Saved! You can move on to the next step or visit the Dashboard.
          </Typography>
        </Paper>
      )}
    </Root>
  );
}
