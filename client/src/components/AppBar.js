import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useIsMount } from '../hooks/useIsMount';
import  { alpha }  from '@mui/material/styles'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MoreIcon from '@mui/icons-material/MoreVert';
import Popover from '@mui/material/Popover';
import { Redirect, Link as RouterLink, useLocation } from "react-router-dom";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const PREFIX = 'AppBar';

const classes = {
  grow: `${PREFIX}-grow`,
  quantityInput: `${PREFIX}-quantityInput`,
  fullWidth: `${PREFIX}-fullWidth`,
  paper: `${PREFIX}-paper`,
  paddingLeft: `${PREFIX}-paddingLeft`,
  menuButton: `${PREFIX}-menuButton`,
  title: `${PREFIX}-title`,
  appBar: `${PREFIX}-appBar`,
  search: `${PREFIX}-search`,
  searchIcon: `${PREFIX}-searchIcon`,
  inputRoot: `${PREFIX}-inputRoot`,
  inputInput: `${PREFIX}-inputInput`,
  sectionDesktop: `${PREFIX}-sectionDesktop`,
  sectionMobile: `${PREFIX}-sectionMobile`,
  routerLinkButton: `${PREFIX}-routerLinkButton`,
  white: `${PREFIX}-white`,
  popoverRoot: `${PREFIX}-popoverRoot`
};

const Root = styled('div')((
  {
    theme,
    drawerwidth
  }
) => ({
  [`& .${classes.grow}`]: {
    flexGrow: 1,
  },

  [`& .${classes.quantityInput}`]: {
    width: 45
  },

  [`& .${classes.fullWidth}`]: {
    width: '100%'
  },

  [`& .${classes.paper}`]: {
    padding: theme.spacing(1),
  },

  [`& .${classes.paddingLeft}`]: {
    paddingLeft: theme.spacing(1)
  },

  [`& .${classes.menuButton}`]: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },

  [`& .${classes.title}`]: {
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },

  [`& .${classes.appBar}`]: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerwidth}px)`,
      marginLeft: drawerwidth,
    },
  },

  [`& .${classes.search}`]: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: '100%',
    },
  },

  [`& .${classes.searchIcon}`]: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  [`& .${classes.inputRoot}`]: {
    color: 'inherit',
  },

  [`& .${classes.inputInput}`]: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },

  [`& .${classes.filterWhite}`]: {
    filter: 'invert(98%) sepia(31%) saturate(146%) hue-rotate(187deg) brightness(117%) contrast(100%)'
  },

  [`& .${classes.sectionDesktop}`]: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },

  [`& .${classes.sectionMobile}`]: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },

  [`& .${classes.routerLinkButton}`]: {
    color: 'black',
    textDecoration: 'none',
    [`:visited`]: {
      color: 'white'
    }
  },

  [`& .${classes.link}`]: {
    color: 'black',
    textDecoration: 'none'
  },

  [`& .${classes.white}`]: {
    color: 'white'
  },

  [`& .${classes.logo}`]: {
    height: '45px'
  },

  [`& .${classes.popoverRoot}`]: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'f',
  }
}));



export default function PrimarySearchAppBar(props) {
  const location = useLocation()

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [search, setSearch] = useState('')
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMount = useIsMount();

  const [cartAnchorEl, setCartAnchorEl] = React.useState(null);
  let cartAnchorRef = useRef('')

  const fulfillment = ['pickup', 'delivery', 'shipping']
  const handleCartPopoverOpen = (event) => {
    if (props.cart.products.length > 0) {
      setCartAnchorEl(event.currentTarget);
    }
  };

  useEffect(() => {
    if (!isMount && props.cart.products.length > 0) {
      setCartAnchorEl(cartAnchorRef.current);
    }
  }, [props.cart.products])

  const handleCartPopoverClose = () => {
    handleMenuClose()
    setCartAnchorEl(null);
  };

  const cartOpen = Boolean(cartAnchorEl && props.cart.products.length > 0);


  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleSignOutButton = () => {
    handleMenuClose()
    props.userSignOut()
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleQuantityChange = (quantity, index) => {
    props.editQuantity({
      quantity: quantity,
      cartIndex: index
    })
  }

  const handleRemoveFromCart = (index) => {
    props.removeFromCart(index)
  }

  function handleHomeClick() {
    console.log(location.pathname)
    if (location.pathname == "/") {
      props.getProducts()
    }
  }

  useEffect(() => {
    props.getProducts({ search: search })
  }, [search])

  const renderSignOutButton = (
    <MenuItem onClick={handleSignOutButton}>Sign Out</MenuItem>
  )
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <RouterLink style={{textDecoration: 'none', color: 'black'}} to='/user/profile'>
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      </RouterLink>
      <RouterLink to='/user/orders' style={{textDecoration: 'none', color: 'black'}}>
        <MenuItem onClick={handleMenuClose}>Orders</MenuItem>
      </RouterLink>
      <RouterLink to='/user/account' style={{textDecoration: 'none', color: 'black'}}>
        <MenuItem onClick={handleMenuClose}>Account</MenuItem>
      </RouterLink>
      {props.userData.loggedIn ? renderSignOutButton : null}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <RouterLink style={{textDecoration: 'none', color: 'black'}} to='/dashboard'>
        <MenuItem>
          <IconButton color="inherit" size="large">
            <Badge color="secondary">
              <DashboardIcon />
            </Badge>
          </IconButton>
          <p>Dashboard</p>
        </MenuItem>
      </RouterLink>
      <MenuItem ref={cartAnchorRef} onClick={handleCartPopoverOpen}>
        <IconButton color="inherit" size="large">
          <Badge badgeContent={props.cart.products.length} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit" size="large">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          size="large">
          <AccountCircle />
        </IconButton>
        <p>User</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Root drawerwidth={props.drawerWidth}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            onClick={props.handleDrawerToggle}
            aria-label="open drawer"
            size="large">
            <MenuIcon />
          </IconButton>
          <RouterLink  onClick={handleHomeClick} to='/' className={`${classes.routerLinkButton} ${classes.white} ${classes.logo}`}>
            <img height="45px" src="/assets/images/logow.svg"
            />
          </RouterLink>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <RouterLink style={{textDecoration: 'none', color: 'white'}} to="/dashboard">
              <IconButton color="inherit" size="large">
                <Badge color="secondary">
                  <DashboardIcon />
                </Badge>
              </IconButton>
            </RouterLink>
            <IconButton
              aria-label="show 4 new mails"
              color="inherit"
              onClick={handleCartPopoverOpen}
              ref={cartAnchorRef}
              size="large">
              <Badge badgeContent={props.cart.products.length} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit" size="large">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              size="large">
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              size="large">
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Popover
        id="mouse-over-popover"
        className={classes.popoverRoot}
        open={cartOpen}
        anchorEl={cartAnchorEl}
        anchorReference='none'
        onClose={handleCartPopoverClose}
        disableRestoreFocus
      >
        <Grid item xs={12}>
          <div>
            <List>
              {props.cart.products.map((product, i) => (
                <ListItem key={i}>
                  <ListItemText>
                    <TextField
                      className={classes.quantityInput}
                      inputProps={{min: 1, style: { textAlign: 'center' }}} 
                      id="quantity"
                      type="number"
                      value={product.quantity}
                      onChange={(e) => {handleQuantityChange(e.target.value, i)}}
                    />
                  </ListItemText>
                  {product.quote ? '' : 
                  <ListItemText 
                    secondary={
                      `package of ${product.product?.Varieties.find(
                        variation => variation.quantity == product.variation
                      ).quantity}`
                    }
                    className={classes.paddingLeft}
                  >
                    {product.product?.name}
                  </ListItemText>}
                  <ListItemText 
                  secondary={product.quantity > 1 
                    ? `$${Number.parseFloat(product.clientSidePrice).toFixed(2)} ea` 
                    : ""}
                  className={classes.paddingLeft}
                  >
                    ${Number.parseFloat(product.clientSidePrice * product.quantity).toFixed(2)}
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {handleRemoveFromCart(i)}}
                      size="large">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              <ListItem>
                <RouterLink to='/checkout' className={`${classes.routerLinkButton} ${classes.fullWidth}`}>
                  <Button 
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleCartPopoverClose}
                  >
                    Checkout
                  </Button>
                </RouterLink>
              </ListItem>
            </List>
          </div>
        </Grid>
      </Popover>
      
      {renderMobileMenu}
      {renderMenu}
    </Root>
  );
}
