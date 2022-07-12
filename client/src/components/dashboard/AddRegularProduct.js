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
  resetContainer: `${PREFIX}-resetContainer`,
  stepLabel: `${PREFIX}-stepLabel`
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
  },

  [`& .${classes.stepLabel}`]: {
    cursor: 'pointer',
    pointerEvents: 'all !important'
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

export default function AddRegularProduct(props) {
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
  const [validProductImages, setValidProductImages] = useState({ error: '', success: edit ? true : false })
  const [imageFormData, setImageFormData] = useState(null)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    product: {
      ...props.product,
      fields: props.product.fields
    },
    shopId: props.shop.id,
    imageFormData: imageFormData
  })
  
  const validate = () => {
    let valid = { error: '', success: edit ? true : false }
    props.setValidProduct(false)
    setMessage('')
    switch (activeStep) {
      case 0:
        valid = validProductImages
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
        props.editProduct(formData)
      }
      props.setValidProduct(true)
    } else {
      setMessage(valid.error)
    }
    return valid
  }

  useEffect(() => {
    if(edit) {
      props.setProductEdit({
        ...product,
        id: product.id,
        custom: product.custom,
        varieties: product.Varieties,
        ingredients: product.Ingredients,
        addons: product.Addons,
        productImages: product.ProductImages,
        fields: []
      })
    } else {
      props.resetProduct()
    }
  }, [])

  const handleNext = () => {
    const valid = validate()
    if (valid.success) {
      if (activeStep === steps.length-1) {
        handleFinish()
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  useEffect(() => {
    const imageFormData = new FormData()
    const files = props.product.imageFiles.map((imageFile, i) => {
      return {
        file: imageFile.file,
        i: i
      }
    })
    
    if (files.length > 0) {
      for (let file of files) {
        if (file.file?.size > 0) {
          imageFormData.append(`photos`, file.file, `images${file.i}`)
        }
      }
      setImageFormData(imageFormData)
    }
  }, [props.product.imageFiles])

  /**
   * Update formData when product or imageFormData changes
   */
  useEffect(() => {
    setFormData({
      ...formData,
      product: {
        ...props.product,
        fields: props.product.fields
      },
      imageFormData: imageFormData
    })
  }, [props.product, imageFormData])

  const handleFinish = () => {
    if (!props.product.id && props.product.valid) {
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
    } else if (props.product.error) {
      setMessage(props.product.error)
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
                case 0: return <AddProductImagesContainer setValidProductImages={setValidProductImages} />
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length -1 ? "Finish" : "Next"}
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
    </Root>
  );
}
