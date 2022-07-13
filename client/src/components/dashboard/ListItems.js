import React from 'react';
import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import RedeemIcon from '@mui/icons-material/Redeem';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom'
import AssignmentIcon from '@mui/icons-material/Assignment';
const PREFIX = 'ListItems';

const classes = {
  routerLink: `${PREFIX}-routerLink`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.routerLink}`]: {
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.87)'
  }
}));

export default function MainListItems() {


  return (
    <Root>
      <Link className={classes.routerLink} to="/dashboard">
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </Link>
      <Link className={classes.routerLink} to="/dashboard/shop/edit">
        <ListItem button>
          <ListItemIcon>
            <StorefrontIcon />
          </ListItemIcon>
          <ListItemText primary="Shop" />
        </ListItem>
      </Link>
      <Link className={classes.routerLink} to="/dashboard/products">
        <ListItem button>
          <ListItemIcon>
            <RedeemIcon />
          </ListItemIcon>
          <ListItemText primary="Products" />
        </ListItem>
      </Link>
      <Link className={classes.routerLink} to="/dashboard/orders">
        <ListItem button>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItem>
      </Link>
      <Link className={classes.routerLink} to="/dashboard/requests">
        <ListItem button>
          <ListItemIcon>
            <RedeemIcon />
          </ListItemIcon>
          <ListItemText primary="Requests" />
        </ListItem>
      </Link>
    </Root>
  );
}

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
  )
