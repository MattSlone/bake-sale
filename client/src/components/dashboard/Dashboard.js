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
import AddProductContainer from '../containers/AddProductContainer';
import AddCustomProductContainer from '../containers/AddCustomProductContainer';
import QuotesContainer from '../containers/QuotesContainer';
import RequestContainer from '../containers/RequestContainer';
import ShopOrdersContainer from '../containers/ShopOrdersContainer';
import ShopOrderContainer from '../containers/ShopOrderContainer';

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

const StyledSwitch = styled(Switch)((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    display: 'flex',
  },

  [`& .${classes.toolbar}`]: {
    paddingRight: 24, // keep right padding when drawer closed
  },

  [`& .${classes.toolbarIcon}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },

  [`& .${classes.appBar}`]: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  [`& .${classes.appBarShift}`]: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  [`& .${classes.menuButton}`]: {
    marginRight: 36,
  },

  [`& .${classes.menuButtonHidden}`]: {
    display: 'none',
  },

  [`& .${classes.title}`]: {
    flexGrow: 1,
  },

  [`& .${classes.drawerPaper}`]: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  [`& .${classes.drawerPaperClose}`]: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },

  [`& .${classes.appBarSpacer}`]: theme.mixins.toolbar,

  [`& .${classes.content}`]: {
    flexGrow: 1,
    //height: '100vh',
    //overflow: 'auto',
  },

  [`& .${classes.container}`]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },

  [`& .${classes.paper}`]: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },

  [`& .${classes.fixedHeight}`]: {
    height: 240,
  }
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
    const UserId = auth.userData.user.success.id
    props.getShop({UserId: UserId})
  })

  const defaultDashboard = (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart />
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Deposits />
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <ShopOrdersContainer />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  )

  return (
    <StyledSwitch>
      <Route path={`${match.path}/shop/create`}>
        <CreateShopContainer />
      </Route>
      <Route path={`${match.path}/shop/edit`}>
        <CreateShopContainer />
      </Route>
      <Route path={`${match.path}/products/add`}>
        <AddProductContainer />
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
        <ShopOrdersContainer />
      </Route>
      <Route path={match.path}>
        {defaultDashboard}
      </Route>
    </StyledSwitch>
  );
}
