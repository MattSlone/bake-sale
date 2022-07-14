import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import AddProductImagesContainer from '../containers/AddProductImagesContainer'
import { useRouteMatch, useParams } from 'react-router-dom'
import FormGeneratorContainer from '../containers/FormGeneratorContainer'
import ListingDetailsContainer from '../containers/ListingDetailsContainer'
import PricingAndInventoryContainer from '../containers/PricingAndInventoryContainer'

const PREFIX = 'AddCustomProduct';

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
    maxWidth: '100%'
  },

  [`& .${classes.desktop}`]: {
    padding: theme.spacing(2)
  },

  [`& .${classes.mobile}`]: {
    padding: theme.spacing(2)
  },

  [`& .${classes.button}`]: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },

  [`& .${classes.actionsContainer}`]: {
    marginBottom: theme.spacing(2)
  },

  [`& .${classes.resetContainer}`]: {
    padding: theme.spacing(3)
  }
}));

function getSteps () {
  return ['Add product images',
    'Listing details',
    'Pricing and fulfillment',
    'Create Custom Form'
  ]
}

export default function AddCustomProduct (props) {
  const [activeStep, setActiveStep] = React.useState(0)
  const steps = getSteps()
  let { id } = useParams()
  const match = useRouteMatch()
  const edit = match.path.includes('edit')
  const matches = useMediaQuery('(min-width:600px)')
  const [product, setProduct] = useState(props.product.products.find(product => product.id === Number(id)))
  const [message, setMessage] = useState('')
  const [validProductImages, setValidProductImages] = useState({ error: '', success: edit ? true : false })
  const [validListingDetails, setValidListingDetails] = useState({ error: '', success: edit ? true : false })
  const [validPricingAndDelivery, setValidPricingAndInventory] = useState({ error: '', success: edit ? true : false })
  const [imageFormData, setImageFormData] = useState(null)
  const [formData, setFormData] = useState({
    product: {
      ...props.product,
      custom: true
    },
    shopId: props.shop.id
  })

  useEffect(() => {
    if (edit) {
      props.setProductEdit({
        ...product,
        id: product.id,
        productImages: product.ProductImages,
        custom: true,
        varieties: product.Varieties,
        ingredients: product.Ingredients,
        addons: product.Addons,
      })
    } else {
      props.resetProduct(true)
    }
  }, [])

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
        custom: true,
        fields: props.product.fields
      },
      imageFormData: imageFormData
    })
  }, [props.product, imageFormData])

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
        valid = validPricingAndDelivery
        break
      case 4:
        valid.success = true
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
    if (props.product.error) {
      setMessage(props.product.error)
    }
  }, [props.product.error])

  const handleNext = () => {
    const valid = validate()
    if (valid.success) {
      if (activeStep === steps.length-1) {
        handleFinish()
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleFinish = () => {
    if (!props.product.id && props.product.valid) {
      props.createProduct(formData)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <Root className={classes.root}>
      <Stepper classes={matches ? { root: classes.desktop } : { root: classes.mobile }} activeStep={activeStep} orientation='vertical'>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {(() => {
                switch (activeStep) {
                  case 0: return <AddProductImagesContainer setValidProductImages={setValidProductImages} />
                  case 1:
                    return <ListingDetailsContainer setValidListingDetails={setValidListingDetails} />
                  case 2:
                    return <PricingAndInventoryContainer setValidPricingAndInventory={setValidPricingAndInventory} custom={true} />
                  case 3:
                    return <FormGeneratorContainer />
                  default:
                    return 'Unknown step'
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
                      return (
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={handleNext}
                          className={classes.button}
                        >
                          {edit ? 'Save' : 'Finish'}
                        </Button>
                      )
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
