import { React, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import CheckoutContainer from './containers/CheckoutContainer';
import Container from '@mui/material/Container';
import axios from 'axios'
import { addToCart } from '../redux';

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
  const [product, setProduct] = useState('')
  const [fulfillment, setFulfillment] = useState('')
  const [price, setPrice] = useState(0)
  const [fulfillmentPrice, setFulfillmentPrice] = useState(0)
  const [secondaryFulfillmentPrice, setSecondaryFulfillmentPrice] = useState(0)

  useEffect(async () => {
    props.resetCart()
  }, [])

  useEffect(async () => {
    props.getQuotes({ forUser: true, id: id })
  }, [props.resetCart])

  useEffect(async () => {
    if (product && fulfillment) {
      getPrices()
    }
  }, [product, fulfillment])

  const getPrices = async () => {
    const item = {
      product: product,
      personalization: '',
      variation: 1,
      fulfillment: fulfillment,
      addons: [],
      quantity: 1
    }
    const res = await axios.post('/api/product/price', item)
    if(res.data.error) {
      console.log(res.data.error)
    } else {
      const prices = res.data.success
      setPrice(Number(prices.productPrice + prices.fulfillmentPrice).toFixed(2))
      setFulfillmentPrice(prices.fulfillmentPrice)
      setSecondaryFulfillmentPrice(prices.secondaryFulfillmentPrice)
    }
  }

  useEffect(() => {
    if (price > 0) {
      addToCart()
    }
  }, [price])

  const addToCart = () => {
    props.addToCart({
      product: product,
      personalization: '',
      variation: 1, // variation = quantity
      fulfillment: fulfillment,
      addons: [],
      productPrice: price - fulfillmentPrice,
      fulfillmentPrice: fulfillmentPrice,
      secondaryFulfillmentPrice: secondaryFulfillmentPrice,
      quantity: 1,
      quote: true
    })
  }

  useEffect(() => {
    const tempQuote = props.quote.quotes.find(quote => quote.id == id)
    if (tempQuote && props.quote.loading == false) {
      setFulfillment(tempQuote.fulfillment)
      setProduct(tempQuote.Product)
    }
  }, [props.quote.getQuotes]);

  return props.cart.products.length > 0 ? <CheckoutContainer /> : ''
}