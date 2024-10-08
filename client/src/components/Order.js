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
import Divider from '@mui/material/Divider';
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
  const [street2, setStreet2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(async () => {
    await setShopDetails()
    if (order.fulfillment !== 'pickup') {
      await setShippingOrDeliveryAddress()
    }
  }, [])

  const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const setShippingOrDeliveryAddress = async () => {
    setStreet(order.FulfillmentAddress.street)
    setStreet2(order.FulfillmentAddress.street2)
    setCity(order.FulfillmentAddress.city)
    setState(order.FulfillmentAddress.state)
    setZipcode(order.FulfillmentAddress.zipcode)
  }

  const convertTo12HourTime = time => {
    const hoursMin = time.split(':')
    return `${(hoursMin[0] % 12) || 12}:${hoursMin[1]}${hoursMin[0] >= 12 ? 'pm' : 'am'}`;
  }

  const setShopDetails = async () => {
    setPhone(order.Product.Shop.ShopContact.phone)
    setEmail(order.Product.Shop.ShopContact.email)
    if (order.fulfillment == 'pickup') {
      const pickupAddress = order.Product.Shop.PickupAddress
      setStreet(pickupAddress.street)
      setCity(pickupAddress.city)
      setState(pickupAddress.state)
      setZipcode(pickupAddress.zipcode)
    }
  }

  return (
    <StyledCard className={classes.card}>
      <CardHeader
        action={
          <Typography variant="h5">
            ${Number.parseFloat(order.total).toFixed(2)}
          </Typography>
        }
        title={order.Product.name}
        subheader={new Date(order.createdAt).toDateString()}
      />
      <CardMedia
        className={classes.cardMedia}
        height="194"
        component="img"
        image={`/api${order.Product.ProductImages[0]?.path}`}
        title={order.Product.name}
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
            <ListItem disableGutters>
              <ListItemText>
                <Box component="span" fontWeight="bold">Item Price: </Box>
                {`$${Number(order.productPrice * order.quantity).toFixed(2)}`}
              </ListItemText>
            </ListItem>
            <ListItem disableGutters>
              <ListItemText>
                <Box component="span" fontWeight="bold">Fulfillment Price: </Box>
                {`$${Number(order.fulfillmentPrice + order.secondaryFulfillmentPrice*(order.quantity-1)).toFixed(2)}`}
              </ListItemText>
            </ListItem>
            <Divider />
              {order.fulfillment == 'shipping' && (
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
              <ListItem disableGutters>
                <ListItemText>
                  <Box display="flex" flexDirection="column">
                    <Box component="span" fontWeight="bold">{capitalize(order.fulfillment)} Location:</Box>
                    <Box>{street}</Box>
                    {street2 && <Box>{street2}</Box>}
                    <Box>{city}, {state}</Box>
                    <Box>{zipcode}</Box>
                  </Box>
                </ListItemText>
              </ListItem>
              {['pickup', 'delivery'].includes(order.fulfillment) &&
              <>
                <ListItem disableGutters>
                  <ListItemText>
                    <Box component="span" fontWeight="bold">{order.fulfillment == 'pickup' ? 'Next Pickup' : 'Delivery'} Date: </Box>
                    {order.nextFulfillmentWindow.date}
                  </ListItemText>
                </ListItem>
                {order.fulfillment == 'pickup' &&
                  <ListItem disableGutters>
                    <ListItemText>
                      <Box component="span" fontWeight="bold">Fulfillment Time: </Box>
                      {convertTo12HourTime(
                        order.nextFulfillmentWindow.dataValues.start
                      )} - {convertTo12HourTime(
                        order.nextFulfillmentWindow.dataValues.end
                      )}
                    </ListItemText>
                  </ListItem>
                }
              </> }
              <Divider />
              <Typography size="1" sx={{fontWeight: 'bold', padding: '4px 0px 4px 0px'}}>
                Shop Contact:
              </Typography>
              <ListItem disableGutters>
                <ListItemText>
                  <Box component="span" fontWeight="bold">Email: </Box>
                  {email}
                </ListItemText>
              </ListItem>
              <ListItem disableGutters>
                <ListItemText>
                  <Box component="span" fontWeight="bold">Phone: </Box>
                  {phone}
                </ListItemText>
              </ListItem>
              {(!order.Product.custom) && 
              <>
                <Divider />
                <ListItem disableGutters>
                  <ListItemText>
                    <Box component="span" fontWeight="bold">Quantity: </Box>
                    {`${order.quantity} package${order.quantity > 1 ? "'s" : ''} of ${order.Variety.quantity}`}
                  </ListItemText>
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText>
                    <Box component="span" fontWeight="bold">Addons: </Box>
                    {order.Addons.length > 0 ? order.Addons.map((addon, index) => (
                      `${index < order.Addons.length-1 ? addon.name + ', ' : addon.name}`
                    )) : "No addons"}
                  </ListItemText>
                </ListItem>
                {order.Product.personalizationPrompt &&
                  <ListItem disableGutters>
                    <ListItemText>
                      <Box component="span" fontWeight="bold">{order.Product.personalizationPrompt}: </Box>
                      {order.personalization ? order.personalization : 'No answer provided'}
                    </ListItemText>
                  </ListItem>
                }
              </>
              }
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
