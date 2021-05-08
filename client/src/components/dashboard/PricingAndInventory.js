import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Input, TextField } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles((theme) => ({
  root: {
      flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  formControl: {
    width: '100%'
  },
}));

export default function PricingAndInventory(props) {
  const classes = useStyles();

  const [price, setPrice] = React.useState(props.price);
  const [inventory, setInventory] = React.useState(props.inventory);

  // wait for setRight to update then create ingredients
  useEffect(() => {
    if(price && inventory) {
      props.setPricingAndInventory({
        price: price,
        inventory: inventory
      })
    }
  }, [price, inventory])

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleInventoryChange = (event) => {
    setInventory(event.target.value);
  };

  return (
  <div className={classes.root}>
    <Container className={classes.cardGrid} maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item>
        <TextField
          placeholder="Price"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                $
              </InputAdornment>
            ),
          }}
          value={price}
          onChange={handlePriceChange}
        />
        </Grid>
        <Grid item>
          <TextField
            placeholder="Inventory"
            type="number"
            value={inventory}
            onChange={handleInventoryChange}
          />
        </Grid>
      </Grid>
    </Container>
  </div>
  );
}
