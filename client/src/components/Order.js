import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import axios from 'axios'
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Redirect, Link as RouterLink } from "react-router-dom";

const PREFIX = 'Order';

const classes = {
  icon: `${PREFIX}-icon`,
  cardGrid: `${PREFIX}-cardGrid`,
  card: `${PREFIX}-card`,
  cardContent: `${PREFIX}-cardContent`,
  footer: `${PREFIX}-footer`,
  routerLinkButton: `${PREFIX}-routerLinkButton`,
  routerLink: `${PREFIX}-routerLink`,
  boldText: `${PREFIX}-boldText`,
  accordion: `${PREFIX}-accordion`,
  accordionSummary: `${PREFIX}-accordionSummary`
};

const StyledCard = styled(Card)((
  {
    theme
  }
) => ({
  [`& .${classes.icon}`]: {
    marginRight: theme.spacing(2),
  },

  [`& .${classes.cardGrid}`]: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(8),
  },

  [`&.${classes.card}`]: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  [`& .${classes.cardContent}`]: {
    flexGrow: 1,
    padding: 0
  },

  [`& .${classes.footer}`]: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },

  [`& .${classes.routerLinkButton}`]: {
    textDecoration: 'none',
  },

  [`& .${classes.routerLink}`]: {
    textDecoration: 'none'
  },

  [`& .${classes.boldText}`]: {
    fontWeight: 'bold'
  },

  [`& .${classes.accordion}`]: {
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
    '&:last-child': {
      borderRadius: 0
    },
  },

  [`& .${classes.accordionSummary}`]: {
    backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, .05)'
    : 'rgba(0, 0, 0, .03)',
  }
}));

export default function Order({ order }) {

  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipcode, setZipcode] = useState('')

  useEffect(async () => {
    order.fulfillment == 'pickup' ? getPickupAddress() : getDeliveryAddress()
  }, [])

  const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const getDeliveryAddress = async () => {
    try {
      const res = await axios.get('/api/user', {
        params: {
          UserId: order.UserId,
          forOrder: true
        }
      })
      if(res.data.error[0]) {
        console.log(res.data.error[0])
      }
      else {
        const user = res.data.success
        setStreet(user.street)
        setCity(user.city)
        setState(user.state)
        setZipcode(user.zipcode)
      }
    } catch(error) {
      console.log('Error getting delivery address')
    }
    
  }

  const getPickupAddress = async () => {
    try {
      const res = await axios.get('/api/shop', {
        params: {
          id: order.Product.ShopId,
          forOrder: true
        }
      })
      if(res.data.error[0]) {
        console.log(res.data.error[0])
      }
      else {
        const pickupAddress = res.data.success.PickupAddress
        setStreet(pickupAddress.street)
        setCity(pickupAddress.city)
        setState(pickupAddress.state)
        setZipcode(pickupAddress.zipcode)
        console.log(res.data.success)
      }
    } catch(error) {
      console.log('Error getting pickup address')
    }
    
  }

  return (
    <StyledCard className={classes.card}>
      <CardHeader
        action={
          <Typography variant="h5">
            ${Number.parseFloat(order.amount).toFixed(2)}
          </Typography>
        }
        title={order.Product.name}
        subheader={new Date(order.createdAt).toDateString()}
      />
      <CardMedia
        className={classes.cardMedia}
        height="194"
        component="img"
        image="https://source.unsplash.com/featured/?baked,goods"
        title="Image title"
      />
      <CardContent className={classes.cardContent}>
        <Accordion className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            className={classes.accordionSummary}
          >
            <Typography>Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List disablePadding dense={true}>
              {order.fulfillment !== 'pickup' && (
              <ListItem disableGutters>
                <ListItemText>
                  <Box component="span" fontWeight="bold">Fulfillment By: </Box>
                  {new Date((new Date).setDate(new Date(order.createdAt).getDate() 
                      + order.Product.processingTime)).toDateString()}
                </ListItemText>
              </ListItem>
              )}
              <ListItem disableGutters>
                <ListItemText>
                  <Box component="span" fontWeight="bold">Fulfillment Type: </Box>
                  {capitalize(order.fulfillment)}
                </ListItemText>
              </ListItem>
              {order.fulfillment == 'pickup' || order.fulfillment == 'delivery' &&
              <ListItem disableGutters>
                <ListItemText>
                <Box display="flex" flexDirection="column">
                  <Box component="span" fontWeight="bold">{capitalize(order.fulfillment)} Location:</Box>
                  <Box>{street}</Box>
                  <Box>{city}, {state}</Box>
                  <Box>{zipcode}</Box>
                </Box>
                </ListItemText>
              </ListItem>
              }
              {order.fulfillment == 'pickup' &&
              <>
                <ListItem disableGutters>
                  <ListItemText>
                    <Box component="span" fontWeight="bold">Next Pickup Date: </Box>
                    {order.nextPickupWindow.date}
                  </ListItemText>
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText>
                    <Box component="span" fontWeight="bold">Pickup Time: </Box>
                    {order.nextPickupWindow.dataValues.start} - {order.nextPickupWindow.dataValues.end}
                  </ListItemText>
                </ListItem>
              </> }
            </List>
          </AccordionDetails>
        </Accordion>
      </CardContent>
      <CardActions>
        <RouterLink className={classes.routerLink} to={`/products/${order.Product.id}`}>
          <Button size="small" color="primary">
            View Product
          </Button>
        </RouterLink>
      </CardActions>
    </StyledCard>
  );
}
