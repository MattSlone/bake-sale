import { React }  from 'react';
import Drawer from './components/Drawer'
import HomeContainer from './components/containers/HomeContainer'
import SignInContainer from './components/containers/SignInContainer'
import SignUpContainer from './components/containers/SignUpContainer'
import DashboardContainer from './components/containers/DashboardContainer'
import ProductContainer from './components/containers/ProductContainer'
import ShopContainer from './components/containers/ShopContainer'
import OrdersContainer from './components/containers/OrdersContainer'
import CustomProductContainer from './components/containers/CustomProductContainer'
import { makeStyles, useTheme } from '@mui/material/styles';

import CheckoutContainer from './components/containers/CheckoutContainer';

import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import ProvideAuthContainer from './components/containers/ProvideAuthContainer';



const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1
  },
}));


export default function App() {
  const classes = useStyles();
  return (
    <ProvideAuthContainer>
      <Router>
        <div className={classes.root}>
          <Drawer />
          <main className={classes.content}>
            <Switch>
              <Route path='/' exact component={HomeContainer} key='/'/>
              <Route path='/signin' component={SignInContainer} key='/signin'/>
              <Route path='/signup' component={SignUpContainer}/>
              <Route path='/signout' component={HomeContainer} key='/'/>
              <Route path='/dashboard' component={DashboardContainer} key='/'/>
              <Route path='/products/custom/:id' children={<CustomProductContainer />} />
              <Route path='/products/:id' children={<ProductContainer />} />
              <Route path='/shop/:id' children={<ShopContainer />} />
              <Route path='/checkout' component={CheckoutContainer} />
              <Route path='/user/orders' component={OrdersContainer} />
            </Switch>
          </main>
        </div>
      </Router>
    </ProvideAuthContainer>
  );
}

// <Routes userData={userData}/>