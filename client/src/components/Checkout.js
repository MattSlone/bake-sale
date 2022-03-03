import { React, useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm'
import { makeStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
const stripePromise = loadStripe("pk_test_51KMDSaL7rHJy0SQFdZI0Q9HFv1wbLuCHm6AuVequIPtqFCa738z7EjGXncDblPZowGe8ALzhjbwh9W25NtejoyxW00YxzwtmYo");
import './Checkout.css'

const useStyles = makeStyles((theme) => ({
  checkoutContainer: {
    padding: theme.spacing(10, 3, 10, 3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(10)
    },
  }
}));
export default function  Checkout(props) {
  const [clientSecret, setClientSecret] = useState("");
  const classes = useStyles()
  

  useEffect(async () => {
    props.checkout(props.cart.products)
  }, []);

  useEffect(() => {
    if (props.cart.clientSecret) {
      setClientSecret(props.cart.clientSecret)
    }
    
  }, [props.cart.clientSecret]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Container className={classes.checkoutContainer}>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {props.cart.products.map((product) => (
          <ListItem key={product.product.name} sx={{ py: 1, px: 0 }}>
            <ListItemText>x{product.quantity}</ListItemText>
            <ListItemText primary={product.product.name} secondary={`package of ${product.variation}`} />
            <Typography variant="body2">{Number.parseFloat(product.clientSidePrice * product.quantity).toFixed(2)}</Typography>
          </ListItem>
        ))}

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ${Number.parseFloat(props.cart.products.map(product => product.clientSidePrice * product.quantity)
              .reduce((prev, curr) => prev + curr)).toFixed(2)}
          </Typography>
        </ListItem>
      </List>
      <div className={classes.paymentForm}>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </Container>
  );
}