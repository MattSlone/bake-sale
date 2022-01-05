import React, { useEffect, useState } from 'react';
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
  const [product, setProduct] = useState(props.product.products.find(product => product.id == id))
  

  const match = useRouteMatch()

  if(match.path.includes('edit')) {
    console.log(product.fields)
    if(product.fields) {
      return <AddCustomProductContainer />
    }
  }

  useEffect(() => {
    if(match.path.includes('edit')) {
      if(product.fields) {
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
      fields: JSON.stringify(props.product.fields)
    },
    shopId: props.shop.id
  }

  const handleFinish = () => {
    handleNext()
    if(match.path.includes('edit')) {
      props.editProduct(formData)
    } else {
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
                      if(match.path.includes('shop/create')) {
                        return ''
                      } else {
                        return <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFinish}
                        className={classes.button}
                      >
                        Finish
                      </Button>
                      }
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
