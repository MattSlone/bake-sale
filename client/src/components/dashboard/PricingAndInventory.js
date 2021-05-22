import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Input, TextField, Typography } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  root: {
      flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  fullWidth: {
    width: '100%'
  },
  tooltip: {
    fontSize: theme.typography.pxToRem(48),
  }
}));

export default function PricingAndInventory(props) {
  const classes = useStyles();

  const [inventory, setInventory] = React.useState(props.inventory);
  const [varieties, setVarieties] = useState(props.varieties)
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [shipping, setShipping] = useState('')
  const [secondaryShipping, setSecondaryShipping] = useState('')
  const [delivery, setDelivery] = useState('')
  const [secondaryDelivery, setSecondaryDelivery] = useState('')

  // wait for setRight to update then create ingredients
  useEffect(() => {
    if(varieties && inventory) {
      props.setPricingAndInventory({
        varieties: varieties,
        inventory: inventory
      })
    }
  }, [varieties, inventory])

  const handleInventoryChange = (event) => {
    setInventory(event.target.value);
  };

  const handleAddVariety = () => {
    let newVarieties = [...varieties]
    newVarieties.push({
      quantity: Number.parseFloat(quantity).toFixed(2),
      price: Number.parseFloat(price).toFixed(2),
      shipping: Number.parseFloat(shipping).toFixed(2),
      secondaryShipping: Number.parseFloat(secondaryShipping).toFixed(2),
      delivery: Number.parseFloat(delivery).toFixed(2),
      secondaryDelivery: Number.parseFloat(secondaryDelivery).toFixed(2)
    })

    if (varieties.length < 5 && !isNaN(price) && price > 0 && quantity > 0 && (shipping > 0 || delivery > 0)) {
      setVarieties(newVarieties)

      setPrice('')
      setQuantity('')
      setShipping('')
      setSecondaryShipping('')
      setDelivery('')
      setSecondaryDelivery('')
    }
    
  }

  const handleDeleteVariety = (i) => {
    let newVarieties = varieties.filter((variety, j) => j !== i)

    setVarieties(newVarieties)
  }

  return (
    <Grid container spacing={2} direction="column" maxWidth="lg">
      <Grid item>
        <Typography>
          Total inventory of product for listing:
        </Typography>
        <TextField
          placeholder="0"
          onChange={handleInventoryChange}
        />
      </Grid>
      <Grid item>
        <Typography>
        Add up to 5 different package quantities for your customers to choose from below:
        </Typography>
        <Grid container spacing={1} direction="column">
        {varieties.map((variety, i) => (
          <Grid item key={i}>
            <Divider padding={10} />
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <Typography>
                <b>Quantity:</b> {variety.quantity}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                <b>Price:</b> ${variety.price}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  <b>Shipping:</b> ${variety.shipping}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  <b>Secondary Shipping:</b> ${variety.secondaryShipping}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  <b>Delivery:</b> ${variety.delivery}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  <b>Secondary Delivery:</b> ${variety.secondaryDelivery}
                </Typography>
              </Grid>
              <Grid item>
               <IconButton aria-label="delete" onClick={() => {handleDeleteVariety(i)}}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        ))}
        </Grid>
      </Grid>
      <Divider />
      <Grid item>
        <Grid container spacing={1}>
        <Grid item xs={12} md={2} lg={1}>
            <TextField
              id="quantity"
              label="Quantity"
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3} lg={2}>
            <TextField
              id="price"
              label="Price"
              placeholder="$0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3} lg={2}>
            <Tooltip title={<Typography>If you offer shipping, you can add the cost for the package here. Otherwise you can leave it blank.</Typography>}>
              <TextField
                id="shipping"
                label="Shipping Cost"
                placeholder="$0.00"
                value={shipping}
                onChange={(e) => setShipping(e.target.value)}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12} md={3} lg={2}>
            <Tooltip title={<Typography>You can add a separate shipping cost for each additional package of this variety a customer orders. 
            You can leave this blank to keep the same shipping cost.</Typography>}>
              <TextField
                id="secondary-shipping"
                label="Secondary Shipping"
                placeholder="$0.00"
                value={secondaryShipping}
                onChange={(e) => setSecondaryShipping(e.target.value)}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12} md={3} lg={2}>
            <Tooltip title={<Typography>If you offer delivery, you can add the cost for the package here. Otherwise you can leave it blank.</Typography>}>  
              <TextField
                id="delivery"
                label="Delivery Cost"
                placeholder="$0.00"
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12} md={3} lg={2}>
            <Tooltip title={<Typography>You can add a separate delivery cost for each additional package of this variety a customer orders. 
            You can leave this blank to keep the same delivery cost.</Typography>}>
              <TextField
                id="secondary-delivery"
                label="Secondary Delivery"
                placeholder="$0.00"
                value={secondaryDelivery}
                onChange={(e) => setSecondaryDelivery(e.target.value)}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleAddVariety} variant="contained" color="primary">Add Variety</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
