import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import ProTip from './ProTip';
import Drawer from './components/Drawer'
import Gallery from './components/Gallery'
import SignUpContainer from './components/containers/SignUpContainer'
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { Provider } from 'react-redux';
import store from './redux/store'

import { BrowserRouter as Router, Route } from "react-router-dom";

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
  { path: '/signin', component: SignUpContainer },
]

const Routes = () => (
  <>
    {<Route path='/' exact component={Gallery} key='/'/>}
    {navItems.map(item =>
      <Route path={item.path} exact component={item.component} key={item.path}/>
    )}
  </>
)


export default function App() {
  const classes = useStyles();

  return (
    <Provider store={store}>
        <div className={classes.root}>
          <Drawer />
          <main className={classes.content}>
            <Router>
              <Routes/>
            </Router>
          </main>
        </div>
    </Provider>
  );
}
