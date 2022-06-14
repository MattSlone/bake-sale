import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBarContainer from './containers/AppBarContainer';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Hidden from '@mui/material/Hidden';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import MainListItems from './dashboard/ListItems';
import Icon from '@mui/material/Icon';
import { loadCSS } from 'fg-loadcss';
import { useTheme } from '@mui/styles';

const PREFIX = 'ResponsiveDrawer';

const classes = {
  root: `${PREFIX}-root`,
  drawer: `${PREFIX}-drawer`,
  listItemText: `${PREFIX}-listItemText`,
  appBar: `${PREFIX}-appBar`,
  menuButton: `${PREFIX}-menuButton`,
  toolbar: `${PREFIX}-toolbar`,
  drawerPaper: `${PREFIX}-drawerPaper`,
  content: `${PREFIX}-content`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    display: 'flex',
  },

  [`& .${classes.drawer}`]: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },

  [`& .${classes.listItemText}`]: {
    marginLeft: theme.spacing(1)
  },

  [`& .${classes.appBar}`]: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },

  [`& .${classes.menuButton}`]: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },

  // necessary for content to be below app bar
  [`& .${classes.toolbar}`]: theme.mixins.toolbar,

  [`& .${classes.drawerPaper}`]: {
    width: drawerWidth,
  },

  [`& .${classes.content}`]: {
    flexGrow: 1,
    padding: theme.spacing(3),
  }
}));

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;

  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const location = useLocation();

  useEffect(() => {
    const node = loadCSS(
      'https://use.fontawesome.com/releases/v5.12.0/css/all.css',
      document.querySelector('#font-awesome-css'),
    );
  })

  const handleListItemClick = (category) => {
    console.log(category)
    props.getProducts({
      category: category
    })
  }

  const handleDrawerToggle = () => {
    console.log('toggling!!!')
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
        {key: 'glutenfree', class: 'fas fa-cloud', text: 'Gluten Free'},
        {key: 'piestarts', class: 'fas fa-stroopwafel', text: 'Pies & Tarts'},
        {key: 'vegetarian', class: 'fas fa-leaf', text: 'Vegan / Vegetarian'}].map((item, index) => (
        <ListItem button key={item.key} onClick={() => handleListItemClick(item.key)}>
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
    <Root>
      <div className={classes.toolbar} />
      <Divider />
      {location.pathname.includes('/dashboard') ? DashboardListItems : DefaultListItems}
    </Root>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Root>
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
        <Hidden smDown implementation="css">
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
    </Root>
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
