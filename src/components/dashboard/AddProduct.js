import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AddProductImagesContainer from '../containers/AddProductImagesContainer';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
  },
  desktop: {
    padding: theme.spacing(5),
  },
  mobile: {
    padding: theme.spacing(0),
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

function getSteps() {
  return ['Add product images',
          'Listing details',
          'Inventory and Pricing',
          'Ingredients',
          'Packaging',
          'Shipping'];
}

export default function AddProduct() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

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

  return (
    <div className={classes.root}>
      <Stepper classes={matches ? {root: classes.desktop} : {root: classes.mobile}} activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
            {(() => {
              switch (activeStep) {
                case 0: return <AddProductImagesContainer />
                case 1:
                  return 'Add Listing Details Here';
                case 2:
                  return `Inventory and Pricing Information Here`;
                case 3:
                  return `List Ingredients`;
                case 3:
                  return `Select Packaging`;
                case 3:
                  return `Shipping Information Here`;
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
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
    </div>
  );
}
