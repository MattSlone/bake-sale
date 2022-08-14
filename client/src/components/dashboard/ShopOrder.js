import { React, useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Carousel from 'react-material-ui-carousel'
import { useParams } from 'react-router-dom'
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const PREFIX = 'Order';

const classes = {
  list: `${PREFIX}-list`,
  listItem: `${PREFIX}-listItem`,
  listItemText: `${PREFIX}-listItemText`,
};

const StyledPaper = styled(Paper)((
  {
    theme
  }
) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),

  [`& .${classes.list}`]: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '500px'
  },

  [`& .${classes.listItem}`]: {
    display: 'flex',
    justifyContent: 'flex-start'
  },

  [`& .${classes.listItemText}`]: {
    flex: 1
  }

}));

export default function ShopOrder(props)
{
  const [order, setOrder] = useState('')

  let { id } = useParams()

  useEffect(() => {
    props.getOrders({ id: [id], forShop: true })
  }, [id])

  useEffect(() => {
    let tempOrder = props.order.orders.find(order => order.id == id)
    if (tempOrder) {
      setOrder(tempOrder)
    }
  }, [props.order.loading])

  const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const getBuyerAddress = () => {
    return `${order.User.street}${order.User.street2 ? ' ' + order.User.street2 : ''}, ${order.User.state} ${order.User.zipcode}`
  }

  const getShopAddress = () => {
    return `${order.User.street}${order.User.street2 ? ' ' + order.User.street2 : ''}, ${order.User.city}, ${order.User.state} ${order.User.zipcode}`
  }

  const convertTo12HourTime = time => {
    const hoursMin = time.split(':')
    return `${(hoursMin[0] % 12) || 12}:${hoursMin[1]}${hoursMin[0] >= 12 ? 'pm' : 'am'}`;
  }

  return ( order ?
    <StyledPaper>
      <Typography sx={{fontWeight: 'bold'}}>
        Order: {order.Product.name}
      </Typography>
      <List className={classes.list}>
          <ListItem className={classes.listItem}>
            <ListItemText
              className={classes.listItemText}
              primary={`${order.User.firstName} ${order.User.lastName}`}
              secondary="Customer Name"
            />
            <ListItemText
              className={classes.listItemText}
              primary={`${order.User.username}`}
              secondary="Customer Email"
            />
          </ListItem>
          <Divider />
          <ListItem className={classes.listItem}>
            <ListItemText
              className={classes.listItemText}
              primary={`$${Number(order.total).toFixed(2)}`}
              secondary="Order Amount"
            />
            <ListItemText
              className={classes.listItemText}
              primary={`$${Number(order.Transfer.payout).toFixed(2)}`}
              secondary="Payout Amount"
            />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              className={classes.listItemText}
              primary={`$${Number(order.productPrice * order.quantity).toFixed(2)}`}
              secondary="Item Price"
            />
            <ListItemText
              className={classes.listItemText}
              primary={`$${Number(order.fulfillmentPrice + order.secondaryFulfillmentPrice*(order.quantity-1)).toFixed(2)}`}
              secondary="Fulfillment Price"
            />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              className={classes.listItemText}
              primary={`$${Number(order.Transfer.ourFee).toFixed(2)}`}
              secondary="Bake.Sale Fee"
            />
            <ListItemText
              className={classes.listItemText}
              primary={`$${Number(order.Transfer.stripeFee).toFixed(2)}`}
              secondary="Stripe Fee"
            />
          </ListItem>
          
          <Divider />
          <ListItem className={classes.listItem}>
            <ListItemText
              className={classes.listItemText}
              primary={order.fulfillment == 'pickup' ?
                order.nextPickupWindow.date
                :
                new Date((new Date).setDate(new Date(order.createdAt).getDate() 
                + order.Product.processingTime)).toDateString()
              }
              secondary="Fulfillment Due By"
            />
            <ListItemText
              className={classes.listItemText}
              primary={capitalize(order.fulfillment)}
              secondary="Fulfillment Type"
            />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary={
                ['shipping', 'delivery'].includes(order.fulfillment) ? getBuyerAddress() : getShopAddress()
              }
              secondary="Fulfillment Location"
            />
          </ListItem>
          {order.fulfillment == 'pickup' &&
          <ListItem className={classes.listItem}>
            <ListItemText
              primary={
                `${convertTo12HourTime(order.nextPickupWindow.dataValues.start)} -
                ${convertTo12HourTime(order.nextPickupWindow.dataValues.end)}`
              }
              secondary="Pickup Time"
            />
          </ListItem>
          }
          <Divider />
          {!order.Product.custom &&
          <>
            <ListItem className={classes.listItem}>
              <ListItemText
                primary={`${order.quantity} package${order.quantity > 1 ? "'s" : ''} of ${order.Variety.quantity}`}
                secondary="Quantity"
              />
            </ListItem>
            <ListItem className={classes.listItem}>
              <ListItemText
                primary={order.Addons.length > 0 ? order.Addons.map((addon, index) => (
                  `${index < order.Addons.length-1 ? addon.name + ', ' : addon.name}`
                )) : "No addons"}
                secondary="Addons"
              />
            </ListItem>
            <ListItem className={classes.listItem}>
              <ListItemText
                primary={order.personalization ? order.personalization : 'No answer provided'}
                secondary="Personalization"
              />
            </ListItem>
          </>
          }
      </List>
    </StyledPaper> : ''
  )
}