import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
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
import LabelingContainer from '../containers/LabelingContainer'
import AddonsContainer from '../containers/AddonsContainer'
import AddCustomProductContainer from '../containers/AddCustomProductContainer'
import PersonalizationContainer from '../containers/PersonalizationsContainer'
import { useRouteMatch, useParams, Redirect } from "react-router-dom";
import { setProductImagesPreview } from '../../redux';
import Personalization from './Personalization';

const PREFIX = 'AddProduct';

const classes = {
  root: `${PREFIX}-root`,
  desktop: `${PREFIX}-desktop`,
  mobile: `${PREFIX}-mobile`,
  button: `${PREFIX}-button`,
  actionsContainer: `${PREFIX}-actionsContainer`,
  resetContainer: `${PREFIX}-resetContainer`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    maxWidth: '100%',
    padding: theme.spacing(2)
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
  }
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
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  let { id } = useParams()
  const match = useRouteMatch()
  const matches = useMediaQuery('(min-width:600px)');
  const edit = match.path.includes('edit')
  const [product, setProduct] = useState(props.product.products.find(product => product.id == id))
  const [validListingDetails, setValidListingDetails] = useState({ error: '', success: edit ? true : false })
  const [validIngredients, setValidIngredients] = useState({ error: '', success: edit ? true : false })
  const [validPricingAndDelivery, setValidPricingAndInventory] = useState({ error: '', success: edit ? true : false })
  const [validAddons, setValidAddons] = useState({ error: '', success: edit ? true : false })
  const [validPersonalization, setValidPersonalization] = useState({ error: '', success: edit ? true : false })
  const [validLabeling, setValidLabeling] = useState({ error: '', success: edit ? true : false })
  const [message, setMessage] = useState('')
  
  const validate = () => {
    let valid = { error: '', success: edit ? true : false }
    //props.setValidShop(false)
    setMessage('')
    switch (activeStep) {
      case 0:
        valid.success = true
        break
      case 1:
        valid = validListingDetails
        break
      case 2:
        valid = validIngredients
        break
      case 3:
        valid = validPricingAndDelivery
        break
      case 4:
        valid = validLabeling
        break
      case 5:
        valid = validAddons
        break
      case 6:
        valid = validPersonalization
        break
      default:
        break
    }
    if (valid.success) {
      if (edit) {
        // edit product
      }
      // create product
    } else {
      setMessage(valid.error)
    }
    return valid
  }

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
        addons: product.Addons,
        fields: []
      })
    } else {
      props.resetProduct()
    }
  }, [])

  const handleNext = () => {
    const valid = validate()
    if (valid.success) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const imageFormData = new FormData()
  useEffect(() => {
    const files = props.product.imageFiles.map((imageFile, i) => {
      return {
        file: imageFile.file,
        i: i
      }
    })
    if (files.length > 0 
        && Object.keys(files[0].file).length > 0
      ) {
        for (let file of files) {
          imageFormData.append(`photos`, file.file, `images${file.i}`)    
        }
      }
  }, [props.product.imageFiles])
  const formData = {
    product: {
      ...props.product,
      fields: props.product.fields
    },
    shopId: props.shop.id,
    imageFormData: imageFormData
  }

  const handleFinish = () => {
    handleNext()
    if(match.path.includes('edit')) {
      props.editProduct(formData)
    } else {
      props.createProduct(formData)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const handleReset = () => {
    setActiveStep(0);
  }

  const handleGoToStep = (i) => {
    const valid = validate()
    if (valid.success) {
      setActiveStep(i)
    } else if (props.shop.error) {
      setMessage(props.shop.error)
    } else {
      setMessage(valid.error)
    }
  }

  return (
    <Root className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, i) => (
          <Step key={label}>
            {edit ?
                <StepLabel className={classes.stepLabel} onClick={(e) => handleGoToStep(i)}>{label}</StepLabel>
              : <StepLabel>{label}</StepLabel>
              }
            <StepContent>
            {(() => {
              switch (activeStep) {
                case 0: return <AddProductImagesContainer product={product} />
                case 1:
                  return <ListingDetailsContainer setValidListingDetails={setValidListingDetails} />;
                case 2:
                  return <IngredientsContainer setValidIngredients={setValidIngredients} />;
                case 3:
                  return <PricingAndInventoryContainer setValidPricingAndInventory={setValidPricingAndInventory} />;
                case 4:
                  return <LabelingContainer setValidLabeling={setValidLabeling} />;
                case 5:
                  return <AddonsContainer setValidAddons={setValidAddons}/>;
                case 6:
                  return <PersonalizationContainer setValidPersonalization={setValidPersonalization} />;
                default:
                  return 'Unknown step';
              }
            })()}
              <Typography style={{color: 'red'}}>
                {message}
              </Typography>
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
    </Root>
  );
}
