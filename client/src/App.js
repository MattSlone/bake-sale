import React from 'react';
import Drawer from './components/Drawer'
import HomeContainer from './components/containers/HomeContainer'
import SignInContainer from './components/containers/SignInContainer'
import SignUpContainer from './components/containers/SignUpContainer'
import DashboardContainer from './components/containers/DashboardContainer'
import ProductContainer from './components/containers/ProductContainer'
import ShopContainer from './components/containers/ShopContainer'
import CustomProductContainer from './components/containers/CustomProductContainer'
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import ProvideAuthContainer from './components/containers/ProvideAuthContainer';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

/*const navItems = [
  { path: '/signin', component: SignInContainer},
  { path: '/signup', component: SignUpContainer},
  { path: '/signout', component: () => <Redirect to='/' /> },
  { path: '/dashboard', component: Dashboard },

]

function Routes ({userData}) {
  return (
    <>
    <Route path='/' exact component={HomeContainer} key='/'/>
    {navItems.map(item =>
      <Route path={item.path} component={item.component} key={item.path}/>
    )}
    </>
  )
}*/


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
            </Switch>
          </main>
        </div>
      </Router>
    </ProvideAuthContainer>
  );
}

// <Routes userData={userData}/>