import { React, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import CheckoutContainer from './containers/CheckoutContainer';
import Container from '@mui/material/Container';

const PREFIX = 'Quote';

const classes = {
  checkoutContainer: `${PREFIX}-checkoutContainer`
};

const StyledContainer = styled(Container)((
  {
    theme
  }
) => ({
  padding: theme.spacing(10, 3, 10, 3),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10)
  }
}));

export default function  Quote(props) {
  let { id } = useParams()

  useEffect(async () => {
    props.resetCart()
  }, []);

  useEffect(async () => {
    props.getQuotes({ forUser: true })
  }, [props.resetCart]);

  useEffect(() => {
    const tempQuote = props.quote.quotes.find(quote => quote.id == id)
    if (tempQuote && props.quote.loading == false) {
      props.addToCart({
        product: tempQuote.Product,
        personalization: '',
        variation: 1, // variation = quantity
        fulfillment: tempQuote.fulfillment,
        addons: [],
        clientSidePrice: tempQuote.price,
        quantity: 1,
        quote: true
      })
      console.log(props.cart.products)
    }
  }, [props.quote.getQuotes]);

  return props.cart.products.length > 0 ? <CheckoutContainer /> : ''
}