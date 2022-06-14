import { React }  from 'react';
import { styled } from '@mui/material/styles';
import HomeContainer from './components/containers/HomeContainer'
import SignInContainer from './components/containers/SignInContainer'
import SignUpContainer from './components/containers/SignUpContainer'
import ForgotPasswordContainer from './components/containers/ForgotPasswordContainer'
import DashboardContainer from './components/containers/DashboardContainer'
import ProductContainer from './components/containers/ProductContainer'
import ShopContainer from './components/containers/ShopContainer'
import OrdersContainer from './components/containers/OrdersContainer'
import CustomProductContainer from './components/containers/CustomProductContainer'
import Box from '@mui/material/Box';
import { useTheme } from '@mui/styles';

import CheckoutContainer from './components/containers/CheckoutContainer';
import QuoteContainer from './components/containers/QuoteContainer';

import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import ProvideAuthContainer from './components/containers/ProvideAuthContainer';
import ResetPassword from './components/ResetPassword';
import ProfileContainer from './components/containers/ProfileContainer';
import AccountContainer from './components/containers/AccountContainer';
import DrawerContainer from './components/containers/DrawerContainer';

const PREFIX = 'App';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`
};

const StyledBox = styled(Box)((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    display: 'flex',
  },

  [`& .${classes.appBarSpacer}`]: {
    height: 64
  },

  [`& .${classes.content}`]: {
    flexGrow: 1,
  }
}));


export default function App() {

  return (
    <ProvideAuthContainer>
      <Router>
        <StyledBox>
          <div className={classes.root}>
            <DrawerContainer />
            <main className={classes.content}>
              <Box sx={{height: 64}} />
              <Switch>
                <Route path='/' exact component={HomeContainer} key='/'/>
                <Route path='/signin' component={SignInContainer} key='/signin'/>
                <Route path='/signup' component={SignUpContainer}/>
                <Route path='/user/profile' component={ProfileContainer}/>
                <Route path='/user/account' component={AccountContainer}/>
                <Route path='/forgotpassword' component={ForgotPasswordContainer}/>
                <Route path='/resetpassword' component={ResetPassword}/>
                <Route path='/signout' component={HomeContainer} key='/'/>
                <Route path='/dashboard' component={DashboardContainer} key='/'/>
                <Route path='/products/custom/:id' children={<CustomProductContainer />} />
                <Route path='/products/:id' children={<ProductContainer />} />
                <Route path='/shop/:id' children={<ShopContainer />} />
                <Route path='/checkout' component={CheckoutContainer} />
                <Route path='/user/orders' component={OrdersContainer} />
                <Route path='/user/quotes/:id' component={QuoteContainer} />
              </Switch>
            </main>
          </div>
        </StyledBox>
      </Router>
    </ProvideAuthContainer>
  );
}

// <Routes userData={userData}/>