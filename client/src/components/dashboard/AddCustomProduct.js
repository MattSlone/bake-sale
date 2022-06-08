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
// import { setProductImagesPreview } from '../../redux'
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
    paddingTop: useRouteMatch().path.includes('add') ? theme.spacing(8) : theme.spacing(10),
    paddingLeft: 0,
    paddingRight: 0
  },

  [`& .${classes.mobile}`]: {
    paddingTop: useRouteMatch().path.includes('add') ? theme.spacing(7) : theme.spacing(0),
    paddingLeft: 0,
    paddingRight: 0
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
  const matches = useMediaQuery('(min-width:600px)')
  const [product, setProduct] = useState(props.product.products.find(product => product.id === Number(id)))

  useEffect(() => {
    if (match.path.includes('edit')) {
      props.setProductEdit({
        ...product,
        id: product.id,
        custom: true
      })
    } else {
      props.resetProduct(true)
    }
  }, [])

  const formData = {
    product: {
      ...props.product,
      custom: true
    },
    shopId: props.shop.id
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const handleFinish = () => {
    handleNext()
    if (match.path.includes('edit')) {
      props.editProduct(formData)
    } else {
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
                  case 0: return <AddProductImagesContainer />
                  case 1:
                    return <ListingDetailsContainer />
                  case 2:
                    return <PricingAndInventoryContainer custom={true} />
                  case 3:
                    return <FormGeneratorContainer />
                  default:
                    return 'Unknown step'
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
                      if (match.path.includes('shop/create')) {
                        return ''
                      } else {
                        return (
                          <Button
                            variant='contained'
                            color='primary'
                            onClick={handleFinish}
                            className={classes.button}
                          >
                            Finish
                          </Button>
                        )
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
    </Root>
  );
}
