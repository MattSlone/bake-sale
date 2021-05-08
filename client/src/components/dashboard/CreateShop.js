import React, { useState } from 'react';
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
import AddProduct from './AddProduct';
import { stateList } from './stateList';
import { useAuth } from '../../hooks/use-auth'
import ShippingAndDeliveryContainer from '../containers/ShippingAndDeliveryContainer';

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
}));

function getSteps() {
  return ['Name your shop', 'Select your state', 'Choose Delivery Area', 'Add product(s)'];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'Choose a name for your shop.';
    case 1:
      return 'Select the state you will be selling in.';
    case 2:
      return 'Choose your delivery area';
      case 3:
        return 'Add a product to your shop';
    default:
      return 'Unknown stepIndex';
  }
}

export default function CreateShop({createShop}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const auth = useAuth();

  const [shopName, setShopName] = useState('')
  const [state, setState] = useState('')

  const handleNext = (e) => {
    if(activeStep === steps.length - 1) {
      handleCreateShop(e)
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
    name: shopName,
    state: state,
    userId: auth.userData.user.success.id
  }

  const handleCreateShop = e => {
    e.preventDefault()
    //createShop(formData)
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
                Create your shop
              </Typography>
              <Typography className={classes.instructions}>All steps completed</Typography>
              <Button onClick={handleReset}>Reset</Button>
            </div>
          ) : (
            <form className={classes.form} noValidate>
              <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                Create your shop
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
                  case 2: return <ShippingAndDeliveryContainer/>
                  case 3: return <AddProduct />
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
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
