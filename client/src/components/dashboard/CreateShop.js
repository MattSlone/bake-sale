import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import isByteLength from 'validator/lib/isByteLength';
import AddProductContainer from '../containers/AddProductContainer';
import Grid from '@mui/material/Grid';
import { stateList } from './stateList';
import { useAuth } from '../../hooks/use-auth'
import { useHistory, useLocation, Switch, Route, Redirect, Link, useRouteMatch } from "react-router-dom";
import PickupAndDeliveryOptionsContainer from '../containers/PickupAndDeliveryOptionsContainer';
import SetupPaymentAccountContainer from '../containers/SetupPaymentAccountContainer';

const PREFIX = 'CreateShop';

const classes = {
  root: `${PREFIX}-root`,
  backButton: `${PREFIX}-backButton`,
  instructions: `${PREFIX}-instructions`,
  appBarSpacer: `${PREFIX}-appBarSpacer`,
  content: `${PREFIX}-content`,
  submit: `${PREFIX}-submit`,
  formControl: `${PREFIX}-formControl`,
  routerLink: `${PREFIX}-routerLink`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    width: '100%',
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
  }
}));

function getSteps(edit) {
  let steps = [
    'Name your shop',
    'Pickup/Delivery Options',
    'Setup Payment Account',
    'Add product(s)'
  ];
  if(edit) {
    steps.splice(2, 2)
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
    case 3:
      return 'Add a product to your shop';
    default:
      return 'Unknown stepIndex';
  }
}

export default function CreateShop(props) {
  const match = useRouteMatch();

  const auth = useAuth();
  const history = useHistory();

  let edit = match.path.includes('edit')

  const steps = getSteps(edit);
  const [shopName, setShopName] = useState(props.shop.name)
  const [state, setState] = useState(props.shop.state)
  const [activeStep, setActiveStep] = useState(0);
  const [tempMessage, setTempMessage] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    for (const field of [
      { name: 'Shop Name', value: shopName }
    ]) {
      if (!field.value) {
        setTempMessage(`${field.name} is required.`)
        props.setValidShop(false)
        return
      }
    }
    if (!isByteLength(shopName, { max: 15 })) {
      setTempMessage("Shop names may have a max of 15 characters.")
      props.setValidShop(false)
      return
    }
    setTempMessage('')
    props.setValidShop(true)
    props.setShop({
      name: shopName
    })
  }, [shopName])

  if(edit && !props.shop.created) {
    history.push("/dashboard/shop/create");
  }

  useEffect(() => {
    if (window.location.href.includes('stripe')) {
      setActiveStep(2)
    }
  }, [])

  const handleNext = (e) => {
    if (props.shop.valid) {
      setMessage('')
      if(edit) {
        if (activeStep === steps.length - 1) {
          handleEditShop(e)
        }
      }
      else if (activeStep === 1) {
        handleCreateShop(e)
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (tempMessage) {
      setMessage(tempMessage)
      setTempMessage('')
    } else if (props.shop.error) {
      setMessage(props.shop.error)
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
    state: state,
    pickupAddress: props.shop.pickupAddress,
    pickupSchedule: props.shop.pickupSchedule,
    allowPickups: props.shop.allowPickups,
    contact: props.shop.contact,
    area: props.shop.area,
    user: auth.userData.user.id
  }

  const handleCreateShop = e => {
    e.preventDefault()
    if (!props.shop.id) {
      props.createShop(formData)
    }
  }

  const handleEditShop = e => {
    e.preventDefault()
    props.editShop(formData)
  }

  return (
    <Root className={classes.root}>
      <main className={classes.content}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
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
                  <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    {match.path.includes('edit') ? 'Edit your shop' : 'Create your shop'}
                  </Typography>
                  {(() => {
                    switch (activeStep) {
                      case 0: return <TextField
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
                      case 1: return <PickupAndDeliveryOptionsContainer />
                      case 2: return <SetupPaymentAccountContainer />
                      case 3: return <AddProductContainer />
                      default: return "";
                    }
                  })()}
                  <Typography color="red">
                    {message}
                  </Typography>
                  <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.backButton}
                    >
                      Back
                    </Button>
                    {!(activeStep === 2) || props.shop.stripeDetailsSubmitted ?
                    <Link to={match.path + (activeStep === 1 ? '/stripe' : '')}>
                      <Button variant="contained" color="primary" onClick={handleNext}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </Link>
                    : ''}   
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
