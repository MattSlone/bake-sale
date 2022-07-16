import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Order from './Order'
import Typography from '@mui/material/Typography';

const PREFIX = 'Orders';

const classes = {
  icon: `${PREFIX}-icon`,
  cardGrid: `${PREFIX}-cardGrid`,
  card: `${PREFIX}-card`,
  cardContent: `${PREFIX}-cardContent`,
  footer: `${PREFIX}-footer`,
  routerLinkButton: `${PREFIX}-routerLinkButton`,
  routerLink: `${PREFIX}-routerLink`
};

const StyledContainer = styled(Container)((
  {
    theme
  }
) => ({
  [`& .${classes.icon}`]: {
    marginRight: theme.spacing(2),
  },

  [`&.${classes.cardGrid}`]: {
    padding: theme.spacing(2)
  },

  [`& .${classes.card}`]: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  [`& .${classes.cardContent}`]: {
    flexGrow: 1,
  },

  [`& .${classes.footer}`]: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },

  [`& .${classes.routerLinkButton}`]: {
    textDecoration: 'none',
  },

  [`& .${classes.routerLink}`]: {
    textDecoration: 'none'
  }
}));

export default function Orders(props) {

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
    <StyledContainer className={classes.cardGrid} maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            Your Orders
          </Typography>
        </Grid>
        {orders.length > 0 ? orders.map((order) => (
          <Grid className={classes.gridItem} item key={order.id} xs={12}>
            <Order order={order} />
          </Grid>
        )) : ''}
      </Grid>
    </StyledContainer>
  );
}
