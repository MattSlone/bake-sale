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
import { useIsMount } from '../../hooks/useIsMount';

const PREFIX = 'AddCustomProduct';

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
  },

  [`& .${classes.stepLabel}`]: {
    cursor: 'pointer',
    pointerEvents: 'all !important'
  },
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
  const isMount = useIsMount()
  const edit = match.path.includes('edit')
  const matches = useMediaQuery('(min-width:600px)')
  const [product, setProduct] = useState(props.product.products.find(product => product.id === Number(id)))
  const [message, setMessage] = useState('')
  const [validProductImages, setValidProductImages] = useState({ error: '', success: edit ? true : false })
  const [validListingDetails, setValidListingDetails] = useState({ error: '', success: edit ? true : false })
  const [validPricingAndDelivery, setValidPricingAndInventory] = useState({ error: '', success: edit ? true : false })
  const [imageFormData, setImageFormData] = useState(null)
  const [fromNext, setFromNext] = useState(false)
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
        ingredients: product.ingredients,
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
      case 3:
        valid.success = true
        break
      default:
        break
    }
    if (valid.success) {
      props.setValidProduct(true)
    } else {
      setMessage(valid.error)
    }
    return valid
  }

  useEffect(() => {
    if (props.product.loading) {
      setMessage('loading...')
    } else {
      if (props.product.error) {
        setMessage(props.product.error)
      } else if (edit && !isMount && !fromNext) {
        setMessage('Your changes have been saved.')
      } else {
        setMessage('')
      }
    }
  }, [props.product.loading])

  const handleNext = () => {
    setFromNext(true)
    const valid = validate()
    if (valid.success) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleSave = () => {
    setFromNext(false)
    const valid = validate()
    if (valid.success) {
      props.editProduct(formData)
    }
  }

  const handleFinish = () => {
    if (!edit && !props.product.id && props.product.valid) {
      props.createProduct(formData)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const handleReset = () => {
    setActiveStep(0)
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
      <Stepper classes={matches ? { root: classes.desktop } : { root: classes.mobile }} activeStep={activeStep} orientation='vertical'>
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
                  {(!edit || activeStep !== steps.length -1) &&
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {activeStep === steps.length -1 ? handleFinish() : handleNext()}}
                      className={classes.button}
                    >
                      {activeStep === steps.length -1 ? 'Finish' : "Next"}
                    </Button>
                  }
                  {edit && 
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                      className={classes.button}
                    >
                      Save
                    </Button>
                  }
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
