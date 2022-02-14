import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Typography } from '@material-ui/core';

import { useRouteMatch, useParams } from "react-router-dom";
import Container from '@material-ui/core/Container';

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
  fullWidth: {
    width: '100%'
  }
}));

export default function SetupPaymentAccount(props) {
  const classes = useStyles();

  useEffect(() => {
    props.createStripeAccount(props.shop.id)
  }, [props.shop.id])

  return (
    <Container disableGutters>
      <Typography variant="body1">
        Bake.Sale partners with strips to provide secure payments for your shop,
        and handle payouts. Click the link below to create your Stripe Payments account.
        You will be redirected to this page when you're done.
      </Typography>
      <Link underline='none' variant='h4' href={props.shop.stripeAccountLink}>
        Setup Link
      </Link>
    </Container>
    
  )
}
