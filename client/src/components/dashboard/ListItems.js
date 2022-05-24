import React from 'react';
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
import { makeStyles } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
  routerLink: {
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.87)'
  }
}));

export default function MainListItems() {
  const classes = useStyles()

  return (
    <div>
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
      <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Quotes Requests" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Customers" />
      </ListItem>
    </div>
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
