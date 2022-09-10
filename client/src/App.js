import { React, useEffect, useState }  from 'react';
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
import Maintenance from './components/Maintenance';
import Box from '@mui/material/Box';
import { useAuth } from './hooks/use-auth';
import { useTheme } from '@mui/styles';
import { useRouteMatch } from "react-router-dom";
import CheckoutContainer from './components/containers/CheckoutContainer';
import QuoteContainer from './components/containers/QuoteContainer';
import { Route, Redirect, Switch, useHistory, useLocation } from "react-router-dom";
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


export default function App({ setAttemptedRoute }) {
  const auth = useAuth()
  const history = useHistory()
  
  const url = useLocation()
  const [location, setLocation] = useState('')
  history.listen((newLocation, action) => {
    if (newLocation.pathname != location)
    setLocation(newLocation.pathname)
  })

  useEffect(() => {
    auth.isLoggedIn()
  }, [location])

  return (
        <StyledBox>
          <div className={classes.root}>
            <DrawerContainer />
            <main className={classes.content}>
              <Box sx={{height: 64}} />
              <Switch>
                <Route path='/' exact component={auth.userData.loggedIn ? HomeContainer : Maintenance} key='/'/>
                <Route path='/signin' component={SignInContainer} key='/signin'/>
                <Route path='/signup' component={SignUpContainer}/>
                <Route path='/forgotpassword' component={ForgotPasswordContainer}/>
                <Route path='/resetpassword' component={ResetPassword}/>
                <Route path='/signout' component={HomeContainer} key='/' beforeEnter/>
                <Route path={["/dashboard", "/checkout", "/user"].concat([
                  "/products", "/s/"
                ])}>
                  {auth.userData.loggedIn ?
                    <Switch>
                      <Route path='/dashboard' component={DashboardContainer} />
                      <Route path='/checkout' component={CheckoutContainer} />
                      <Route path='/user/quotes/:id' component={QuoteContainer} />
                      <Route path='/user/orders' component={OrdersContainer} />
                      <Route path='/user/profile' component={ProfileContainer}/>
                      <Route path='/user/account' component={AccountContainer}/>
                      <Route path='/products/custom/:id' children={<CustomProductContainer />} />
                      <Route path='/products/:id' children={<ProductContainer />} />
                      <Route path='/s/:id' children={<ShopContainer />} />
                    </Switch>
                  : (!['/', '/signin', '/signup', '/forgotpassword', '/resetpassword'].includes(url.pathname) ? setAttemptedRoute(url.pathname) : true)
                   && <Redirect to="/signin" />}
                </Route>
              </Switch>
            </main>
          </div>
        </StyledBox>
  );
}

// <Routes userData={userData}/>