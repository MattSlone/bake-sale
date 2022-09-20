import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import isByteLength from 'validator/lib/isByteLength';
import Grid from '@mui/material/Grid';
import { useAuth } from '../../hooks/use-auth'
import { useHistory, Link, useRouteMatch } from "react-router-dom";
import PickupAndDeliveryOptionsContainer from '../containers/PickupAndDeliveryOptionsContainer';
import SetupPaymentAccountContainer from '../containers/SetupPaymentAccountContainer';
import axios from 'axios';

const PREFIX = 'CreateShop';

const classes = {
  root: `${PREFIX}-root`,
  backButton: `${PREFIX}-backButton`,
  instructions: `${PREFIX}-instructions`,
  appBarSpacer: `${PREFIX}-appBarSpacer`,
  content: `${PREFIX}-content`,
  submit: `${PREFIX}-submit`,
  formControl: `${PREFIX}-formControl`,
  routerLink: `${PREFIX}-routerLink`,
  stepLabel: `${PREFIX}-stepLabel`,
  description: `${PREFIX}-description`,
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    width: '100%',
  },

  [`& .${classes.stepLabel}`]: {
    cursor: 'pointer',
    pointerEvents: 'all !important'
  },

  padding: theme.spacing(2),

  [`& .${classes.backButton}`]: {
    marginRight: theme.spacing(1),
  },

  [`& .${classes.instructions}`]: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },

  [`& .${classes.content}`]: {
    flexGrow: 1,
    //height: '100vh',
    //overflow: 'auto',
  },

  [`& .${classes.submit}`]: {
    margin: theme.spacing(3, 0, 2),
  },

  [`& .${classes.formControl}`]: {
    margin: theme.spacing(1),
    minWidth: 120,
  },

  [`& .${classes.routerLink}`]: {
    textDecoration: 'none'
  },

  [`& .${classes.description} textarea`]: {
    resize: 'vertical'
  }
}));

function getSteps(edit) {
  let steps = [
    'Name your shop',
    'Pickup/Delivery Options',
    'Setup Payment Account',
  ];
  if(edit) {
    steps.splice(3, 1)
  }
  return steps
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'Choose a name for your shop.';
    case 1:
      return 'Configure your pickup and delivery preferences';
    case 2:
        return 'Setup your Stripe Payments account';
    default:
      return 'Nuh uh';
  }
}

export default function CreateShop(props) {
  const match = useRouteMatch();
  const edit = match.path.includes('edit')
  const auth = useAuth();
  const history = useHistory();
  const steps = getSteps(edit);
  const [shopName, setShopName] = useState(props.shop.name)
  const [description, setDescription] = useState(props.shop.description)
  const [activeStep, setActiveStep] = useState(0);
  const [message, setMessage] = useState('')
  const [childStep, setChildStep] = useState(0)
  const [childStepsLength, setChildStepsLength] = useState(1)
  const [validPickupAndDelivery, setValidPickupAndDelivery] = useState(false)
  const [readyEditShop, setReadyEditShop] = useState({ready: false})
  const [goToStep, setGoToStep] = useState(0)

  const validateShopName = async () => {
    for (const field of [
      { name: 'Shop Name', value: shopName },
      { name: 'Shop Description', value: description }
    ]) {
      if (!field.value) {
        setMessage(`${field.name} is required.`)
        return false
      }
      setMessage('loading...')
      const res = await axios.get('/api/shop/validateName', {
        params: {
          name: shopName
        }
      })
      if (res.data.error) {
        setMessage(`Shop name is taken or invalid.`)
        return false
      }
    }
    if (!isByteLength(shopName, { max: 30 })) {
      setMessage("Shop names may have a max of 30 characters.")
      return false
    }
    if (!isByteLength(description, { max: 2000 })) {
      setMessage("Shop descriptions may have a max of 2000 characters.")
      return false
    }
    props.setShop({
      name: shopName
    })
    setMessage('')
    return true
  }

  if(edit && !props.shop.created) {
    history.push("/dashboard/shop/create");
  }

  useEffect(() => {
    if (window.location.href.includes('stripe')) {
      setGoToStep(2)
      setActiveStep(2)
    }
  }, [])

  const handleFinish = async (e) => {
    if (await validate()) {
      handleCreateShop(e)
      setActiveStep((prevActiveStep) => prevActiveStep + 1) 
      setGoToStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleNext = async (e) => {
    if (activeStep === 1) {
      handleFinish(e)
    } else {
      if (await validate()) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1) 
        setGoToStep((prevActiveStep) => prevActiveStep + 1)
      }
    }
  };

  const handleSave = async (e) => {
    if (await validate()) {
      props.editShop(formData)
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  let formData = {
    id: props.shop.id,
    name: shopName,
    description: description,
    pickupAddress: props.shop.pickupAddress,
    pickupSchedule: props.shop.pickupSchedule,
    allowPickups: props.shop.allowPickups,
    contact: props.shop.contact,
    area: props.shop.area,
    deliverySchedule: {
      Sunday: props.shop.deliveryDays.includes('Sunday'),
      Monday: props.shop.deliveryDays.includes('Monday'),
      Tuesday: props.shop.deliveryDays.includes('Tuesday'),
      Wednesday: props.shop.deliveryDays.includes('Wenesday'),
      Thursday: props.shop.deliveryDays.includes('Thursday'),
      Friday: props.shop.deliveryDays.includes('Friday'),
      Saturday: props.shop.deliveryDays.includes('Saturday'),
    },
    user: auth.userData.user.id
  }

  const editShop = () => {
    props.editShop(formData)
  }

  useEffect(() => {
    if (edit && readyEditShop.ready) {
      editShop()
    }
  }, [readyEditShop])

  const handleCreateShop = e => {
    e.preventDefault()
    if (!props.shop.id && props.shop.valid) {
      props.createShop(formData)
    }
  }

  const validate = async () => {
    let valid = false
    props.setValidShop(false)
    setMessage('')
    switch (activeStep) {
      case 0:
        valid = await validateShopName()
        break
      case 1:
        valid = validPickupAndDelivery
        break
      default:
        valid = true
        break
    }
    if (valid) {
      props.setValidShop(true)
    }
    return valid
  }

  useEffect(() => {
    if (!props.shop.loading) {
      if (props.shop.error) {
        setMessage(props.shop.error)
      } else {
        if (activeStep === 0) {
          setMessage('Your changes have been saved.')
        }
      }
    } else if (activeStep === 0) {
      setMessage('loading...')
    }
  }, [props.shop.loading])

  useEffect(() => {
    setMessage('')
  }, [activeStep])

  const handleGoToStep = (i) => {
    setGoToStep(i)
    if (i == 0) {
      setChildStep(0)
    }
    setActiveStep(i)
  }

  return (
    <Root className={classes.root}>
      <main className={classes.content}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, i) => (
            <Step key={label}>
              {edit ?
                <StepLabel className={classes.stepLabel} onClick={(e) => handleGoToStep(i)}>{label}</StepLabel>
              : <StepLabel>{label}</StepLabel>
              }
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                {props.shop.created ? (edit ? "Edits Saved!" : "Shop Created!") : "Create your shop"}
              </Typography>
              {props.shop.created ? (
                <Grid container alignContent="center" direction="column">
                  <Link className={classes.routerLink} to="/dashboard">
                    <Button variant="contained" color="primary">Go to dashboard</Button>
                  </Link>
                </Grid>
              ) : (
                <div>
                  <Typography className={classes.instructions}>All steps completed</Typography>
                  <Button onClick={handleReset}>Reset</Button>
                </div>
              )}
            </div>
          ) : (
            <form className={classes.form} noValidate>
              {(
                <div>
                  <Typography component="h1" variant="h2" align="center" color="textPrimary">
                    {match.path.includes('edit') ? 'Edit your shop' : 'Create your shop'}
                  </Typography>
                  {(() => {
                    switch (activeStep) {
                      case 0: 
                        return (
                          <>
                          <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Shop Name"
                            name="name"
                            value={shopName}
                            autoFocus
                            onChange={e => setShopName(e.target.value)}
                          />
                          <TextField
                            className={classes.description}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            multiline
                            rows={4}
                            id="name"
                            label="Shop Description"
                            name="description"
                            value={description}
                            autoFocus
                            onChange={e => setDescription(e.target.value)}
                          />
                          </>
                        )
                      case 1: return <PickupAndDeliveryOptionsContainer
                        setChildStep={setChildStep}
                        childStep={childStep}
                        setChildStepsLength={setChildStepsLength}
                        setParentMessage={setMessage}
                        setReadyEditShop={setReadyEditShop}
                        setValidPickupAndDelivery={setValidPickupAndDelivery}
                      />
                      case 2: return <SetupPaymentAccountContainer />
                      default: return "";
                    }
                  })()}
                  <Typography style={{color: 'red'}}>
                    {message}
                  </Typography>
                  <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                    <div>
                      { childStep == 0 ?
                        <Button
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          className={classes.backButton}
                        >
                          Back
                        </Button>
                      : '' }
                      {(
                        (activeStep == 0)
                        || (edit && childStep == 0)
                        || childStep == childStepsLength 
                      ) && (
                        !(activeStep === 2)
                        || props.shop.stripeDetailsSubmitted 
                      ) && (
                        !edit || activeStep !== steps.length - 1
                      ) && (
                        <Link style={{textDecoration: 'none', marginRight: '5px'}} to={match.path + (activeStep === 1 && validPickupAndDelivery ? '/stripe' : '')}>
                          <Button variant="contained" color="primary" onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                          </Button>
                        </Link>
                      )}
                      {(edit && (activeStep == 0)) &&
                        <Button variant="contained" color="primary" onClick={handleSave}>
                          Save
                        </Button>
                      }
                    </div>
                </div>
              )}
            </form>
          )}
        </div>
      </main>
    </Root>
  );
}
