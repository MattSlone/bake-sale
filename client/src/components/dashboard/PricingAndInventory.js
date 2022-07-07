import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const PREFIX = 'PricingAndInventory';

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  fullWidth: `${PREFIX}-fullWidth`,
  tooltip: `${PREFIX}-tooltip`
};

const StyledGrid = styled(Grid)((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
      flexGrow: 1,
  },

  [`& .${classes.paper}`]: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },

  [`& .${classes.fullWidth}`]: {
    width: '100%'
  },

  [`& .${classes.tooltip}`]: {
    fontSize: theme.typography.pxToRem(48),
  }
}));

export default function PricingAndInventory(props) {
  const [inventory, setInventory] = useState(props.inventory);
  const [varieties, setVarieties] = useState(props.varieties)
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState('')
  const [deliveryFeeType, setDeliveryFeeType] = useState('')
  const [shipping, setShipping] = useState(0)
  const [secondaryShipping, setSecondaryShipping] = useState(0)
  const [delivery, setDelivery] = useState(0)
  const [secondaryDelivery, setSecondaryDelivery] = useState(0)
  const [message, setMessage] = useState('')

  const validateVariety = () => {
    let rtn = { error: '', success: false }
    if (quantity <= 0) {
      rtn.error = "Quantity must be greater than 0."
      return rtn
    } else if (price < 1) {
      rtn.error = "Product price must be at least $1.00"
      return rtn
    }
    rtn.success = true
    return rtn
  }

  const validate = () => {
    let rtn = { error: '', success: false }
    if (inventory <= 0) {
      rtn.error = "Inventory must be greater than 0."
      return rtn
    } else if ((varieties.length <= 0) || (varieties.length > 5)) {
      rtn.error = "Products must have at least one variety, \
        and a maximum of 5."
      return rtn
    }
    rtn.success = true
    return rtn
  }

  useEffect(() => {
    const valid = validate()
    props.setValidPricingAndInventory(valid)
    if(valid.success) {
      props.setPricingAndInventory({
        varieties: varieties,
        inventory: inventory
      })
    }
  }, [varieties, inventory])

  const handleInventoryChange = (event) => {
    setInventory(event.target.value);
  };

  const handleSelectDeliveryFeeType = (event) => {
    setDeliveryFeeType(event.target.value);
  };

  const handleAddVariety = () => {
    const valid = validateVariety()
    if (valid.success) {
      setMessage('')
      let newVarieties = [...varieties]
      newVarieties.push({
        quantity: quantity,
        price: price,
        shipping: shipping,
        secondaryShipping: secondaryShipping,
        deliveryFeeType: deliveryFeeType,
        delivery: delivery,
        secondaryDelivery: secondaryDelivery
      })
      if (varieties.length < 5 && price !== null && quantity > 0) {
        setVarieties(newVarieties)
      }
    } else {
      setMessage(valid.error)
    }
  }

  const handleDeleteVariety = (i) => {
    let newVarieties = varieties.filter((variety, j) => j !== i)
    setVarieties(newVarieties)
  }


  return props.custom ? <PricingAndInventoryCustom varieties={varieties} setInventory={setInventory} setVarieties={setVarieties}/> : (
    <StyledGrid container spacing={2} direction="column">
      <Grid item>
        <Typography>
          Total inventory of product for listing:
        </Typography>
        <TextField
          placeholder="0"
          value={inventory}
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
                <b>Quantity:</b> {Number(variety.quantity.toFixed(2))}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                <b>Price:</b> ${Number(variety.price).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  <b>Shipping:</b> {variety.shipping > 0 ? `$${Number(variety.shipping).toFixed(2)}`: "NA"}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  <b>Secondary Shipping:</b> {variety.shipping > 0 && variety.secondaryShipping > 0 ? `$${Number(variety.secondaryShipping).toFixed(2)}`: "NA"}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  <b>Delivery:</b> {variety.delivery > 0 ? `$${(variety.deliveryFeeType == 'mile') ? `${Number(variety.delivery).toFixed(2)}/mi` : Number(variety.delivery).toFixed(2)}`: "NA"}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  <b>Secondary Delivery:</b> {variety.delivery > 0 && variety.secondaryDelivery > 0 ? `$${(variety.deliveryFeeType == 'mile') ? `${Number(variety.secondaryDelivery).toFixed(2)}/mi` : Number(variety.secondaryDelivery).toFixed(2)}`: "NA"}
                </Typography>
              </Grid>
              <Grid item>
               <IconButton aria-label="delete" onClick={() => {handleDeleteVariety(i)}} size="large">
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
        <Grid item xs={12} sm={6} md={2} lg={1}>
            <TextField
              className={classes.fullWidth}
              id="quantity"
              label="Quantity"
              required
              type="number"
              placeholder="0"
              onChange={(e) => {setQuantity(Number(e.target.value))}}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <TextField
              className={classes.fullWidth}
              id="price"
              label="Price"
              required
              placeholder="$0.00"
              onChange={(e) => {setPrice(Number(e.target.value))}}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Tooltip title={<Typography>If you offer shipping, you can add the cost for the package here. Otherwise you can leave it blank.</Typography>}>
              <TextField
                className={classes.fullWidth}
                id="shipping"
                label="Shipping Cost"
                placeholder="$0.00"
                onChange={(e) => {setShipping(Number(e.target.value))}}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Tooltip title={<Typography>You can add a separate shipping cost for each additional package of this variety a customer orders
              after the first one. You can leave this blank to keep the same shipping cost.</Typography>}>
              <TextField
                className={classes.fullWidth}
                id="secondary-shipping"
                label="Secondary Shipping"
                disabled={!shipping ? true : false}
                placeholder="$0.00"
                onChange={(e) => {setSecondaryShipping(Number(e.target.value))}}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} >
          <Tooltip title={<Typography>Choose between a flat-rate delivery, or by the mile. By the mile 
             delivery fees are calculated by the distance between your home/kitchen and the delivery address.</Typography>}>
              <FormControl variant="outlined" className={classes.fullWidth}>
                <InputLabel id="delivery-type-label">Delivery Fee Type</InputLabel>
                <Select
                  labelId="variation-label"
                  id="variation-select"
                  label="Delivery Fee Type"
                  value={deliveryFeeType}
                  onChange={handleSelectDeliveryFeeType}
                >
                  <MenuItem value=''>Select</MenuItem>
                  <MenuItem value={'flat'}>Flat-rate</MenuItem> 
                  <MenuItem value={'mile'}>By the mile</MenuItem> 
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Tooltip title={<Typography>If you offer delivery, you can add the cost for the package here. Otherwise you can leave it blank.</Typography>}>  
              <TextField
                className={classes.fullWidth}
                id="delivery"
                label="Delivery Cost"
                disabled={!deliveryFeeType ? true : false}
                placeholder="$0.00"
                onChange={(e) => {setDelivery(Number(e.target.value))}}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Tooltip title={<Typography>You can add a separate delivery cost for each additional package of this variety a customer orders. 
            You can leave this blank to keep the same delivery cost.</Typography>}>
              <TextField
                className={classes.fullWidth}
                id="secondary-delivery"
                label="Secondary Delivery"
                disabled={!delivery ? true : false}
                placeholder="$0.00"
                onChange={(e) => {setSecondaryDelivery(Number(e.target.value))}}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <Typography style={{color: 'red'}}>
              {message}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleAddVariety} variant="contained" color="primary">Add Variety</Button>
          </Grid>
        </Grid>
      </Grid>
    </StyledGrid>
  );
}

function PricingAndInventoryCustom(props) {
  const [deliveryFeeType, setDeliveryFeeType] = useState('flat')
  const [shipping, setShipping] = useState(null)
  const [delivery, setDelivery] = useState(null)
  const [message, setMessage] = useState('')
  
  useEffect(() => {
    props.setInventory(1)
  }, [])

  const handleSelectDeliveryFeeType = (event) => {
    setDeliveryFeeType(event.target.value);
  };

  const handleAddVariety = () => {
    let newVarieties = [...props.varieties]
    newVarieties.push({
      quantity: 1,
      price: 0,
      shipping: shipping,
      secondaryShipping: 0,
      deliveryFeeType: deliveryFeeType,
      delivery: delivery,
      secondaryDelivery: 0
    })

    if (props.varieties.length < 1 && (shipping !== null || delivery !== null)) {
      props.setVarieties(newVarieties)
    }
    
  }

  const handleDeleteVariety = (i) => {
    let newVarieties = props.varieties.filter((variety, j) => j !== i)
    props.setVarieties(newVarieties)
  }

  return (
    <StyledGrid container spacing={2} direction="column">
      <Grid item>
        <Grid container spacing={1} direction="column">
        {props.varieties.map((variety, i) => (
          <Grid item key={i}>
            <Divider padding={10} />
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <Typography>
                  <b>Shipping:</b> {(typeof variety.shipping === 'number') ? `$${variety.shipping.toFixed(2)}`: "NA"}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  <b>Delivery:</b> {(typeof variety.delivery === 'number') ? `$${(variety.deliveryFeeType == 'mile') ? `${variety.delivery.toFixed(2)}/mi` : variety.delivery.toFixed(2)}`: "NA"}
                </Typography>
              </Grid>
              <Grid item>
               <IconButton aria-label="delete" onClick={() => {handleDeleteVariety(i)}} size="large">
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
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Tooltip title={<Typography>If you offer shipping, you can add the cost for the package here. Otherwise you can leave it blank.</Typography>}>
              <TextField
                className={classes.fullWidth}
                id="shipping"
                label="Shipping Cost"
                placeholder="$0.00"
                onChange={(e) => {setShipping(Number(e.target.value))}}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} >
          <Tooltip title={<Typography>Choose between a flat-rate delivery, or by the mile. By the mile 
             delivery fees are calculated by the distance between your home/kitchen and the delivery address.</Typography>}>
              <FormControl variant="outlined" className={classes.fullWidth}>
                <InputLabel id="delivery-type-label">Delivery Fee Type</InputLabel>
                <Select
                  labelId="variation-label"
                  id="variation-select"
                  label="Delivery Fee Type"
                  value={deliveryFeeType}
                  onChange={handleSelectDeliveryFeeType}
                >
                  <MenuItem value={'flat'}>Flat-rate</MenuItem> 
                  <MenuItem value={'mile'}>By the mile</MenuItem> 
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Tooltip title={<Typography>If you offer delivery, you can add the cost for the package here. Otherwise you can leave it blank.</Typography>}>  
              <TextField
                className={classes.fullWidth}
                id="delivery"
                label="Delivery Cost"
                placeholder="$0.00"
                onChange={(e) => {setDelivery(Number(e.target.value))}}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <Typography style={{color: "red"}}>
              {message}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleAddVariety} variant="contained" color="primary">Save</Button>
          </Grid>
        </Grid>
      </Grid>
    </StyledGrid>
  );
}