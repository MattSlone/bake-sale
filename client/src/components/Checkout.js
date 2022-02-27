import { React, useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm'
import axios from 'axios'
import { makeStyles } from '@material-ui/styles';


const useStyles = makeStyles((theme) => ({
  paymentForm: {
    marginTop: theme.spacing(10)
  }
}));
export default function  Checkout(props) {
  const [clientSecret, setClientSecret] = useState("");
  const classes = useStyles()
  const stripePromise = loadStripe("pk_test_51KMDSaL7rHJy0SQFdZI0Q9HFv1wbLuCHm6AuVequIPtqFCa738z7EjGXncDblPZowGe8ALzhjbwh9W25NtejoyxW00YxzwtmYo");

  useEffect(async () => {
    props.checkout(props.cart.products)
  }, []);

  useEffect(() => {
    if (props.cart.clientSecret) {
      setClientSecret(props.cart.clientSecret)
    }
    
  }, [props.cart.clientSecret]);

  useEffect( () => {
    if (clientSecret) {
      console.log(clientSecret)
    }
  }, [clientSecret]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className={classes.paymentForm}>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}