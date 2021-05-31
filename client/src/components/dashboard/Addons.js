import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Input, TextField, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';


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

export default function Addons(props) {
  const classes = useStyles();

  const [addons, setAddons] = useState(props.addons)
  const [price, setPrice] = useState('')
  const [secondaryPrice, setSecondaryPrice] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    if(addons) {
      props.setAddons(addons)
    }
  }, [addons])

  const handleCreateAddon = () => {
    let newAddons = [...addons]
    newAddons.push({
      name: name,
      price: Number.parseFloat(price),
      secondaryPrice: secondaryPrice ? Number.parseFloat(secondaryPrice) : Number.parseFloat(price)
    })

    if (addons.length < 5 && !isNaN(price) && price > 0 && name.length > 0) {
      setAddons(newAddons)
    }
  }

  const handleDeleteAddon = (i) => {
    let newAddons = addons.filter((addon, j) => j !== i)

    setAddons(newAddons)
  }

  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        <Typography>
          Create up to 5 additional optional add-ons for your product:
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} xl={4}>
        <List>
          {addons.map((addon, i) => (
            <ListItem key={i}>
              <ListItemText secondary={`$${addon.price.toFixed(2)} + $${!isNaN(addon.secondaryPrice) ? addon.secondaryPrice.toFixed(2) : addon.price.toFixed(2)} per additional item`}>
                {addon.name}
              </ListItemText>
              <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => {handleDeleteAddon(i)}}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Grid>
      <Grid item>
        <Grid container alignContent="start" spacing={1}>
        <Grid item>
            <TextField
              id="optionName"
              label="Name"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              id="price"
              label="Price"
              placeholder="$0.00"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Tooltip title={<Typography>Add-on prices are per item (not package). You can set a separate price for each
              additional item, or set it to $0.00 for the add-on to cost the same regardless of package quantity, or leave blank
              to have the same price for each additonal item.
            </Typography>}>  
              <TextField
                id="secondaryPrice"
                label="Secondary Price"
                placeholder="$0.00"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setSecondaryPrice(e.target.value)}
              />
            </Tooltip>
          </Grid>
          <Grid item>
            <Button onClick={handleCreateAddon} variant="contained" color="primary">Create Add-on</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
