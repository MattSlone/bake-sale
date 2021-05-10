import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBarContainer from './containers/AppBarContainer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import MainListItems from './dashboard/ListItems';
import Icon from '@material-ui/core/Icon';
import { loadCSS } from 'fg-loadcss';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  listItemText: {
    marginLeft: theme.spacing(1)
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const location = useLocation();

  useEffect(() => {
    const node = loadCSS(
      'https://use.fontawesome.com/releases/v5.12.0/css/all.css',
      document.querySelector('#font-awesome-css'),
    );
  })

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const style = {
    width: '2em',
    color: 'rgba(0, 0, 0, 0.54)'
  }

  const DefaultListItems = (
    <>
    <List>
      <ListSubheader inset>Categories</ListSubheader>
      {[{key: 'bread', class: 'fas fa-bread-slice', text: 'Bread'},
        {key: 'cakes', class: 'fas fa-birthday-cake', text: 'Cakes'},
        {key: 'candy', class: 'fas fa-candy-cane', text: 'Candy & Chocolate'},
        {key: 'gluten-free', class: 'fas fa-cloud', text: 'Gluten Free'},
        {key: 'pies-tarts', class: 'fas fa-stroopwafel', text: 'Pies & Tarts'},
        {key: 'vegetarian', class: 'fas fa-leaf', text: 'Vegan / Vegetarian'}].map((item, index) => (
        <ListItem button key={item.key}>
          <Icon className={item.class} style={style}/>
          <ListItemText className={classes.listItemText} primary={item.text} />
        </ListItem>
      ))}
    </List>
    </>
  )

  const DashboardListItems = (
    <>
    <List>
      <MainListItems />
    </List>
    </>
  )

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      {location.pathname.includes('/dashboard') ? DashboardListItems : DefaultListItems}
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBarContainer position="fixed" drawerWidth="240" handleDrawerToggle={handleDrawerToggle} />
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
