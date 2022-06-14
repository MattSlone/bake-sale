import { React, useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Carousel from 'react-material-ui-carousel'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const PREFIX = 'Request';

const classes = {
  product: `${PREFIX}-product`,
  personalizationBox: `${PREFIX}-personalizationBox`,
  card: `${PREFIX}-card`,
  cardMedia: `${PREFIX}-cardMedia`,
  sidebar: `${PREFIX}-sidebar`,
  top: `${PREFIX}-top`,
  titles: `${PREFIX}-titles`,
  requestQuoteButton: `${PREFIX}-requestQuoteButton`,
  formControl: `${PREFIX}-formControl`,
  descTitle: `${PREFIX}-descTitle`
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const StyledPaper = styled(Paper)((
  {
    theme
  }
) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
}));

export default function ShopOrder(props)
{
  const [order, setOrder] = useState('')

  let { id } = useParams()

  useEffect(() => {
    props.getOrders({ orders: [id], forShop: true })
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
    return `${order.User.street}, ${order.User.city}, ${order.User.state} ${order.User.zipcode}`
  }

  return ( order ?
    <StyledPaper>
      <Typography sx={{fontWeight: 'bold'}}>
        Order: {order.Product.name}
      </Typography>
      <List>
          <ListItem>
            <ListItemText
              primary={new Date((new Date).setDate(new Date(order.createdAt).getDate() 
                + order.Product.processingTime)).toDateString()}
              secondary="Fulfillment Due By"
            />
            <ListItemText
              primary={capitalize(order.fulfillment)}
              secondary="Fulfillment Type"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`$${order.amount}`}
              secondary="Order Amount"
            />
            <ListItemText
              primary={`$${order.Transfer.amount}`}
              secondary="Payment Amount"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                order.fulfillment == 'delivery' ? getBuyerAddress() : getShopAddress()
              }
              secondary="Fulfillment Location"
            />
          </ListItem>
      </List>
    </StyledPaper> : ''
  )
}