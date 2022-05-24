import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddProductImagesContainer from '../containers/AddProductImagesContainer';
import ListingDetailsContainer from '../containers/ListingDetailsContainer'
import IngredientsContainer from '../containers/IngredientsContainer'
import PricingAndInventoryContainer from '../containers/PricingAndInventoryContainer'
import Labeling from './Labeling'
import AddonsContainer from '../containers/AddonsContainer'
import AddCustomProductContainer from '../containers/AddCustomProductContainer'
import PersonalizationContainer from '../containers/PersonalizationsContainer'
import { useRouteMatch, useParams, Redirect } from "react-router-dom";
import { setProductImagesPreview } from '../../redux';
import Personalization from './Personalization';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
  },
  desktop: {
    paddingTop: useRouteMatch().path.includes('add') ? theme.spacing(8) : theme.spacing(10),
    paddingLeft: 0,
    paddingRight: 0
  },
  mobile: {
    paddingTop: useRouteMatch().path.includes('add') ? theme.spacing(7) : theme.spacing(0),
    paddingLeft: 0,
    paddingRight: 0
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
          'Ingredients',
          'Inventory and Pricing',
          'Labeling',
          'Add-ons',
          'Personalization'
        ];
}

export default function AddProduct(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  let { id } = useParams()
  console.log(props.product)
  const [product, setProduct] = useState(props.product.products.find(product => product.id == id))
  

  const match = useRouteMatch()

  useEffect(() => {
    if(match.path.includes('edit')) {
      if(product.custom) {
        return <AddCustomProductContainer />
      }
      props.setProductEdit({
        ...product,
        id: product.id,
        custom: false,
        varieties: product.Varieties,
        ingredients: product.Ingredients,
        addons: product.Addons
      })
    } else {
      props.resetProduct()
    }
  }, [])

  const includeButtons = () => {
    return (activeStep === steps.length - 1) && (!match.path.includes('shop/create')) ? 'Finish' : 'Next'
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const formData = {
    product: {
      ...props.product,
      fields: props.product.fields
    },
    shopId: props.shop.id
  }

  const handleFinish = () => {
    handleNext()
    if(match.path.includes('edit')) {
      props.editProduct(formData)
    } else {
      console.log(formData)
      props.createProduct(formData)
    }
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
                  return <ListingDetailsContainer />;
                case 2:
                  return <IngredientsContainer />;
                case 3:
                  return <PricingAndInventoryContainer />;
                case 4:
                  return <Labeling />;
                case 5:
                  return <AddonsContainer />;
                case 6:
                  return <PersonalizationContainer />;
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
                      return <Button
                      variant="contained"
                      color="primary"
                      onClick={handleFinish}
                      className={classes.button}
                      >
                        Finish
                      </Button>
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
    </div>
  );
}
