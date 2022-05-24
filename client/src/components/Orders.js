import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Order from './Order'

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  cardGrid: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  routerLinkButton: {
    textDecoration: 'none',
  },
  routerLink: {
    textDecoration: 'none'
  }
}));

export default function Orders(props) {
  const classes = useStyles();
  const [orders, setOrders] = useState([])

  useEffect(() => {
    props.getOrders()
  }, [])

  useEffect(() => {
    if (props.order.orders) {
      setOrders(props.order.orders)
    }
  }, [props.order.loading])

  return (
    <Container className={classes.cardGrid} maxWidth="lg">
      <Grid container spacing={4}>
        {orders.map((order) => (
          <Grid className={classes.gridItem} item key={order.id} xs={12}>
            <Order order={order} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
