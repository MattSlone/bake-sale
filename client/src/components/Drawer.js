import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBarContainer from './containers/AppBarContainer';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Hidden from '@mui/material/Hidden';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
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
  content: `${PREFIX}-content`,
  routerLinkButton: `${PREFIX}-routerLinkButton`,
  white: `${PREFIX}-white`,
  logo: `${PREFIX}-logo`,
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
  [`& .${classes.toolbar}`]: { 
    ...theme.mixins.toolbar,
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  [`& .${classes.drawerPaper}`]: {
    width: drawerWidth,
  },

  [`& .${classes.content}`]: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },

  [`& .${classes.routerLinkButton}`]: {
    color: 'black',
    textDecoration: 'none',
    [`:visited`]: {
      color: 'white'
    }
  },

  [`& .${classes.white}`]: {
    color: 'white'
  },

  [`& .${classes.logo}`]: {
    display: 'flex'
  }
}));

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const history = useHistory()
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const location = useLocation();

  useEffect(() => {
    const node = loadCSS(
      'https://use.fontawesome.com/releases/v6.2.0/css/all.css',
      document.querySelector('#font-awesome-css'),
    );
  })

  const handleListItemClick = (category) => {
    props.setCategory(category)
    if (location.pathname !== '/') {
      history.push('/', { from: 'drawer' })
    } else {
      props.getProducts({
        category: category
      })
      props.getProductsCount({
        category: category
      })
    }
  }

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
      {[
        {key: 'breadandpastries', class: 'fas fa-bread-slice', text: 'Bread & Pastries'},
        {key: 'cakesandcupcakes', class: 'fas fa-birthday-cake', text: 'Cakes & Cupcakes'},
        {key: 'cookies', class: 'fas fa-cookie', text: 'Cookies'},
        {key: 'candyandchocolate', class: 'fas fa-candy-cane', text: 'Candy & Chocolate'},
        {key: 'piesandtarts', class: 'fas fa-stroopwafel', text: 'Pies & Tarts'},
        {key: 'honeyandjams', class: 'fas fa-jar', text: 'Honey & Jams'},
        {key: 'fruitandsnuts', class: 'fas fa-apple-whole', text: 'Fruits & Nuts'},
        {key: 'herbsandspices', class: 'fas fa-pepper-hot', text: 'Herbs & Spices'},
        {key: 'other', class: 'fas fa-bowl-food', text: 'Other'}
      ].map((item, index) => (
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
      <MainListItems shop={props.shop} />
    </List>
    </>
  )

  function handleHomeClick() {
    const parts = hostname.split('.')
    console.log(parts)
    if (parts.length > 2 || (parts.length > 1 && parts[1] == 'localhost')) {
      // subdomain is present
      const [, ...newParts] = parts
      const newPath = newParts.join('.')
      const port = parts[1] == 'localhost' ? 3000 : 443
      window.location.replace(`${window.location.protocol}//${newPath}:${port}`)
      history.push('/', { from: 'appbar' })
    }
    history.push('/', { from: 'appbar' })
    if (location.pathname == "/") {
      props.setCategory('')
      props.getProducts({
        page: 1
      })
      props.getProductsCount()
    }
  }

  const drawer = (
    <Root>
      <div className={classes.toolbar}>
        <div onClick={handleHomeClick} className={`${classes.routerLinkButton} ${classes.white} ${classes.logo}`}>
            <img height="55px" src="/assets/images/logow.svg"
            />
          </div>
      </div>
      
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
