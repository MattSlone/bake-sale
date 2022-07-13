import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useRouteMatch } from 'react-router-dom';

const PREFIX = 'SetupPaymentAccount';

const classes = {
  detailsSubmittedText: `${PREFIX}-detailsSubmittedText`
};

const StyledContainer = styled(Container)((
  {
    theme
  }
) => ({
  [`& .${classes.detailsSubmittedText}`]: {
    color: 'red'
  }
}));

export default function SetupPaymentAccount(props) {
  const [message, setMessage] = useState('')
  const match = useRouteMatch();
  const edit = match.path.includes('edit')

  useEffect(() => {
    if (window.location.href.includes('return')) {
      props.checkStripeDetailsSubmitted(props.shop.stripeAccountId)
    } else if (window.location.href.includes('reauth')) {
      props.createStripeAccount(props.shop.id, edit)
      setMessage('Stripe Account Link Expired. Generating a new one...')
    }
  }, [])

  useEffect(() => {
    props.checkStripeDetailsSubmitted(props.shop.stripeAccountId)
  }, [])

  useEffect(() => {
    if (props.shop.loading == false 
      && props.shop.id
      && !props.shop.stripeDetailsSubmitted
      && !props.shop.stripeAccountLink
      && !props.shop.error) {
      setMessage('')
      props.createStripeAccount(props.shop.id, edit)
    } else if (props.shop.error) {
      setMessage(props.shop.error)
    }
  }, [props.shop.loading])

  useEffect(() => {
    if (props.shop.stripeDetailsSubmitted) {
      setMessage("Your stripe account has been created! You're good to go!")
    }
  }, [props.shop.stripeDetailsSubmitted])

  return (
    <StyledContainer disableGutters>
      <Typography variant="body1">
        Bake.Sale partners with Stripe to provide secure payments for your shop,
        and handle payouts. Click the link below to create your Stripe Payments account.
        You will be returned to this page when you're done. You can skip this step for now, 
        but won't be able to publish products until it's completed.
      </Typography>
      <Typography className={classes.detailsSubmittedText} style={{color: 'red'}}>
        {message}
      </Typography>
      {!props.shop.error ?
        props.shop.stripeDetailsSubmitted ?
          <div>
            <Link underline='none' target="_blank" href={'https://dashboard.stripe.com'}>
              <Button variant="contained" color="primary">
                Go to Stripe
              </Button>
            </Link>
          </div>
          : 
          <div>
            <Link underline='none' href={props.shop.stripeAccountLink}>
              <Button variant="contained" color="primary">
                Setup Stripe
              </Button>
            </Link>
            <RouterLink style={{marginLeft: '1em', fontDecoration: 'none'}} to="/dashboard">
              <Button variant="contained" color="primary">
                Skip
              </Button>
            </RouterLink>
          </div>
      : ''}
    </StyledContainer>
  );
}
