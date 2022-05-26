import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Link, Typography } from '@mui/material';

import { useRouteMatch, useParams } from "react-router-dom";
import Container from '@mui/material/Container';

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
    color: 'blue'
  }
}));

export default function SetupPaymentAccount(props) {


  useEffect(() => {
    if (window.location.href.includes('return')) {
      props.checkStripeDetailsSubmitted(props.shop.stripeAccountId)
    } else if (window.location.href.includes('reauth')) {
      // nothing yet TODO
    }
  }, [])

  useEffect(() => {

  }, [props.shop.stripeDetailsSubmitted])

  useEffect(() => {
    props.createStripeAccount(props.shop.id)
  }, [props.shop.id])

  return (
    <StyledContainer disableGutters>
      <Typography variant="body1">
        Bake.Sale partners with Stripe to provide secure payments for your shop,
        and handle payouts. Click the link below to create your Stripe Payments account.
        You will be returned to this page when you're done. You must create your stripe
        account before continuing.
      </Typography>
      {props.shop.stripeDetailsSubmitted ? 
      <Typography className={classes.detailsSubmittedText} variant="body1">
        Your stripe account has been created! You're good to go!
      </Typography>
      : 
      <Link underline='none' variant='h4' href={props.shop.stripeAccountLink}>
        Setup Link
      </Link>
      }
    </StyledContainer>
  );
}
