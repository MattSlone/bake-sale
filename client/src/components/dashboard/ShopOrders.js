import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Title from './Title';
import { Link as RouterLink } from 'react-router-dom'

const PREFIX = 'Orders';

const classes = {
  seeMore: `${PREFIX}-seeMore`,
  row: `${PREFIX}-row`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  padding: theme.spacing(2),

  [`& .${classes.row}`]: {
    overflowX: 'auto',
  }
}));

export default function ShopOrders(props) {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    props.getOrders({ forShop: true })
  }, [])

  useEffect(() => {
    if (props.order.orders) {
      setOrders(props.order.orders)
    }
  }, [props.order.loading])

  return (
    <Root>
      <Title>Orders</Title>
      <Grid container direction='column'>
        <Grid item xs={12}>
          <Grid spacing={1} container>
            {['Date', 'Product', 'Customer', ''].map(name => 
              <Grid item xs={3}>
                <span style={{fontWeight: 'bold'}}>{name}</span>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Divider />
        {orders.length > 0 ? orders.map((row) => (
          <>
          <Grid item xs={12}>
            <Grid spacing={1} container direction='row'>
              <Grid className={classes.row} item xs={3}>{new Date(row.createdAt).toDateString()}</Grid>
              <Grid className={classes.row} item xs={3}>{row.Product.name}</Grid>
              <Grid className={classes.row} item xs={3}>{`${row.User.firstName} ${row.User.lastName}`}</Grid>
              <Grid className={classes.row} item xs={3}><RouterLink to={`/dashboard/orders/${row.id}`}>View Order</RouterLink></Grid>
            </Grid>
          </Grid>
          <Divider />
          </>
        )) : ''}
      </Grid>
    </Root>
  );
}
