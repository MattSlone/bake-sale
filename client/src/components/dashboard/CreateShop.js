import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AddProductContainer from '../containers/AddProductContainer';
import Grid from '@material-ui/core/Grid';
import { stateList } from './stateList';
import { useAuth } from '../../hooks/use-auth'
import { useHistory, Redirect, Link, useRouteMatch } from "react-router-dom";
import ShippingAndDeliveryContainer from '../containers/ShippingAndDeliveryContainer';
import PickupAndDeliveryOptionsContainer from '../containers/PickupAndDeliveryOptionsContainer';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    //height: '100vh',
    //overflow: 'auto',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  routerLink: {
    textDecoration: 'none'
  }
}));

function getSteps(edit) {
  let steps = ['Name your shop', 'Select your state', 'Pickup/Delivery Options', 'Add product(s)'];
  if(edit) {
    steps.pop()
  }
  return steps
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'Choose a name for your shop.';
    case 1:
      return 'Select the state you will be selling in.';
    case 2:
      return 'Configure your pickup and delivery preferences';
      case 3:
        return 'Add a product to your shop';
    default:
      return 'Unknown stepIndex';
  }
}

export default function CreateShop(props) {
  const match = useRouteMatch();
  const classes = useStyles();
  const auth = useAuth();
  const history = useHistory();

  let edit = match.path.includes('edit')

  const steps = getSteps(edit);
  const [shopName, setShopName] = useState(props.shop.name)
  const [state, setState] = useState(props.shop.state)
  const [activeStep, setActiveStep] = React.useState(0);

  // wait for update then set shop
  useEffect(() => {
    if(shopName && state) {
      props.setShop({
        name: shopName,
        state: state
      })
    }
  }, [shopName, state])

  useEffect(() => {
  }, [props.shop.created])

  if(edit && !props.shop.created) {
    history.push("/dashboard/shop/create");
  }

  const handleNext = (e) => {
    console.log(edit)
    if(activeStep === steps.length - 1) {
      console.log(edit)
      if(edit) {
        handleEditShop(e)
      } else {
        handleCreateShop(e)
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
    product: {
      ...props.product,
      fields: JSON.stringify(props.product.fields)
    },
    user: auth.userData.user.success.id
  }

  const handleCreateShop = e => {
    e.preventDefault()
    props.createShop(formData)
  }

  const handleEditShop = e => {
    e.preventDefault()
    props.editShop(formData)
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
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
              {(!match.path.includes('edit') && props.shop.created) ? (<Redirect to="/dashboard"/>) : (
                <div>
                  <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    {match.path.includes('edit') ? 'Edit your shop' : 'Create your shop'}
                  </Typography>
                  {(() => {
                    switch (activeStep) {
                      case 0: return <>
                                      <Container component="main" maxWidth="xs">
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
                                      </Container>
                                    </>;
                      case 1: return <>
                                      <Container component="main" maxWidth="xs">
                                        <InputLabel id="state-select-label">State</InputLabel>
                                        <Select
                                          labelId="state-select-label"
                                          id="state-select"
                                          value={state}
                                          displayEmpty
                                          required
                                          fullWidth
                                          onChange={e => setState(e.target.value)}
                                        >
                                          {stateList.map((item) => (
                                            <MenuItem key={item.Code} value={item.Code}>{item.State}</MenuItem>
                                          ))}
                                        </Select>
                                      </Container>
                                      </>;
                      case 2: return <PickupAndDeliveryOptionsContainer />
                      case 3: return <AddProductContainer />
                      default: return "";
                    }
                  })()}
                  <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.backButton}
                    >
                      Back
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleNext}>
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
