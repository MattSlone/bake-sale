import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import ProTip from './ProTip';
import Drawer from './components/Drawer'
import SignUpContainer from './components/containers/SignUpContainer'
import HomeContainer from './components/containers/HomeContainer'
import SignInContainer from './components/containers/SignInContainer'
import Dashboard from './components/dashboard/Dashboard'
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
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

const navItems = [
  { path: '/signin', component: SignInContainer},
  { path: '/signup', component: SignUpContainer},
  { path: '/signout', component: () => <Redirect to='/' /> },
  { path: '/dashboard', component: Dashboard }
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
}


export default function App({userData}) {
  const classes = useStyles();
  return (
    <ProvideAuthContainer>
      <Router>
        <div className={classes.root}>
          <Drawer />
          <main className={classes.content}>
            <Routes userData={userData}/>
          </main>
        </div>
      </Router>
    </ProvideAuthContainer>
  );
}
