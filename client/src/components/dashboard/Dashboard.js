import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './ShopOrders';
import { useAuth } from '../../hooks/use-auth'
import { Switch, Route, Redirect, useRouteMatch } from "react-router-dom";
import CreateShopContainer from "../containers/CreateShopContainer"
import ProductsContainer from "../containers/ProductsContainer"
import AddRegularProductContainer from '../containers/AddRegularProductContainer';
import AddCustomProductContainer from '../containers/AddCustomProductContainer';
import QuotesContainer from '../containers/QuotesContainer';
import RequestContainer from '../containers/RequestContainer';
import ShopOrdersContainer from '../containers/ShopOrdersContainer';
import ShopOrderContainer from '../containers/ShopOrderContainer';
import AddProductContainer from '../containers/AddProductContainer';

const PREFIX = 'Dashboard';

const classes = {
  root: `${PREFIX}-root`,
  toolbar: `${PREFIX}-toolbar`,
  toolbarIcon: `${PREFIX}-toolbarIcon`,
  appBar: `${PREFIX}-appBar`,
  appBarShift: `${PREFIX}-appBarShift`,
  menuButton: `${PREFIX}-menuButton`,
  menuButtonHidden: `${PREFIX}-menuButtonHidden`,
  title: `${PREFIX}-title`,
  drawerPaper: `${PREFIX}-drawerPaper`,
  drawerPaperClose: `${PREFIX}-drawerPaperClose`,
  appBarSpacer: `${PREFIX}-appBarSpacer`,
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`,
  paper: `${PREFIX}-paper`,
  fixedHeight: `${PREFIX}-fixedHeight`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  padding: theme.spacing(2),

  [`& .${classes.paper}`]: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },

  [`& .${classes.noPaddingPaper}`]: {
    display: 'flex',
    flexDirection: 'column',
  },

  [`& .${classes.fixedHeight}`]: {
    height: 240,
  }
}));

const drawerWidth = 240;

export default function Dashboard(props) {
  const auth = useAuth();
  const match = useRouteMatch();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  if (!auth.userData.loggedIn) {
    return (
      <Redirect to='/signin' />
    )
  }

  useEffect(() => {
    props.getShop({ UserId: auth.userData.user})
  }, [])

  const defaultDashboard = (
    <Root>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <Chart />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper} >
            <Deposits />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper className={classes.noPaddingPaper}>
            <ShopOrdersContainer />
          </Paper>
        </Grid>
      </Grid>
    </Root>
  )

  return (
    <Switch>
      <Route path={`${match.path}/shop/create`}>
        <CreateShopContainer />
      </Route>
      <Route path={`${match.path}/shop/edit`}>
        <CreateShopContainer />
      </Route>
      <Route path={`${match.path}/products/add`}>
        <AddRegularProductContainer />
      </Route>
      <Route path={`${match.path}/products/add-custom`}>
        <AddCustomProductContainer />
      </Route>
      <Route path={`${match.path}/products/:id/edit`}>
        <AddProductContainer />
      </Route>
      <Route path={`${match.path}/products`}>
        <ProductsContainer />
      </Route>
      <Route path={`${match.path}/requests/:id`}>
        <RequestContainer />
      </Route>
      <Route path={`${match.path}/requests`}>
        <QuotesContainer />
      </Route>
      <Route path={`${match.path}/orders/:id`}>
        <ShopOrderContainer />
      </Route>
      <Route path={`${match.path}/orders`}>
        <ShopOrdersContainer singlePage={true} />
      </Route>
      <Route path={match.path}>
        {defaultDashboard}
      </Route>
    </Switch>
  );
}
