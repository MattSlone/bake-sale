import { React, useState, useEffect, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useLocation } from 'react-router-dom';
const stripePromise = loadStripe("pk_test_51KMDSaL7rHJy0SQFdZI0Q9HFv1wbLuCHm6AuVequIPtqFCa738z7EjGXncDblPZowGe8ALzhjbwh9W25NtejoyxW00YxzwtmYo");
import './Checkout.css'

const PREFIX = 'Checkout';

const classes = {
  checkoutContainer: `${PREFIX}-checkoutContainer`
};

const StyledContainer = styled(Container)((
  {
    theme
  }
) => ({
  padding: theme.spacing(2),
}));

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function  Checkout(props) {
  const query = useQuery()
  const [clientSecret, setClientSecret] = useState(query.get('payment_intent_client_secret'))
  const [message, setMessage] = useState("")
  const [paymentComplete, setPaymentComplete] = useState(false)
  useEffect(() => {
    if (props.cart.products.length > 0) {
      props.checkout(props.cart.products)
    } else {
      setClientSecret('')
    }
  }, [props.cart.products]);

  useEffect(() => {
    console.log('heree 1')
    if (paymentComplete) {
      props.resetCart()
    }
  }, [paymentComplete])

  useEffect(() => {
    if (props.cart.loading == false) {
      if (props.cart.error) {
        setMessage(props.cart.error)
      } else {
        setClientSecret(props.cart.clientSecret)
      }
    }
  }, [props.cart.loading])

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <StyledContainer className={classes.checkoutContainer}>
      {!paymentComplete ?
      <div>
        <Typography variant="h6" gutterBottom>
          Order summary
        </Typography>
        <List disablePadding>
          {props.cart.products.map((product) => (
            <ListItem key={product.product.name} sx={{ py: 1, px: 0 }}>
              <ListItemText>x{product.quantity}</ListItemText>
              <ListItemText primary={product.product.name} secondary={product.quote ? '' : `package of ${product.variation}`} />
              <Typography variant="body2">{Number.parseFloat(product.clientSidePrice * product.quantity).toFixed(2)}</Typography>
            </ListItem>
          ))}

          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Total" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              ${Number.parseFloat(props.cart.products.map(product => product.clientSidePrice * product.quantity)
                .reduce((prev, curr) => prev + curr, 0)).toFixed(2)}
            </Typography>
          </ListItem>
        </List>
        <Typography style={ { color: 'red' } }>
          {message}
        </Typography>
        <div className={classes.paymentForm}>
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm setPaymentComplete={setPaymentComplete} resetCart={props.resetCart} />
            </Elements>
          )}
        </div>
      </div>
      :
      <Typography variant="h6" gutterBottom>
        Thanks for your order!
        Check your email for an order confirmation.
      </Typography>
      }
      
    </StyledContainer>
  );
}