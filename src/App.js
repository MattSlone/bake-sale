import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import ProTip from './ProTip';
import Drawer from './components/Drawer'
import Gallery from './components/Gallery'
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { Provider } from 'react-redux';
import store from './redux/store'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <Provider store={store}>
      <div className={classes.root}>
        <Drawer />
        <main className={classes.content}>
          <Gallery />
        </main>
      </div>
    </Provider>
  );
}
