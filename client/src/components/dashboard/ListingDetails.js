import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Input, TextField } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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

export default function ListingDetails(props) {
  const classes = useStyles();

  const [name, setName] = React.useState(props.name);
  const [description, setDescription] = React.useState(props.description);
  const [category, setCategory] = React.useState(props.category);
  const [processingTime, setProcessingTime] = React.useState(props.processingTime);
  const [automaticRenewal, setAutomaticRenewal] = React.useState(props.automaticRenewal)

  useEffect(() => {
    if(name && category && processingTime) {
      props.setListingDetails({
        name: name,
        description: description,
        category: category,
        processingTime: processingTime,
        automaticRenewal: automaticRenewal
      })
    }
  }, [name, description, category, processingTime, automaticRenewal])

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleRenewalCheckboxChange = (event) => {
    setAutomaticRenewal(event.target.checked);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescChange = (event) => {
    setDescription(event.target.value);
  };

  const handleProcessingTimeChange = (event) => {
    setProcessingTime(event.target.value);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.root}>
        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={2}>
            <Grid container item xs={12} md={4}>
              Title: Include keywords that buyers would use to search for your item.
            </Grid>
            <Grid item xs={12} md={8}>
              <FormControl className={classes.formControl}>
                <TextField value={name} label="Title" onChange={handleNameChange}/>
              </FormControl>
            </Grid>
            <Grid container item xs={12} md={4}>
              Category: Select from a list of categories as designated by your state's cottage food laws.
            </Grid>
            <Grid item xs={12} md={8}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <MenuItem value={'bread'}>Bread</MenuItem>
                  <MenuItem value={'cakes'}>Cakes</MenuItem>
                  <MenuItem value={'candy,chocolate'}>Candy & Chocolate</MenuItem>
                  <MenuItem value={'glutenfree'}>Gluten Free</MenuItem>
                  <MenuItem value={'pies,tarts'}>Pies & Tarts</MenuItem>
                  <MenuItem value={'vegan,vegetarian'}>Vegan / Vegetarian</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid container item xs={12} md={4}>
              Processing Time: Let your customers know when they can expect their order to be ready.
            </Grid>
            <Grid item xs={12} md={8}>
              <FormControl className={classes.formControl}>
                <TextField 
                type="number"
                inputProps={{min: 1}} 
                value={processingTime} 
                label="Days" 
                onChange={handleProcessingTimeChange}/>
              </FormControl>
            </Grid>
            <Grid container item xs={12} md={4}>
              Automatic Renewal: Each renewal lasts for four months or until the listing sells out. Get more details on auto-renewing here.
            </Grid>
            <Grid item xs={12} md={8}>
              <FormControl className={classes.formControl}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={automaticRenewal}
                      onChange={handleRenewalCheckboxChange}
                      name="checked"
                      color="primary"
                    />
                  }
                  label="Automatic Renewal"
                />
              </FormControl>
            </Grid>
            <Grid container item xs={12} md={4}>
              Description: Start with a brief overview that describes your item’s finest features. Shoppers will only see the first few lines of your description at first, so make it count!
              Not sure what else to say? Shoppers also like hearing about your process, and the story behind this item.
            </Grid>
            <Grid item xs={12} md={8}>
              <FormControl className={classes.formControl}>
                <TextField
                  value={description}
                  id="outlined-multiline-static"
                  label="Description"
                  multiline
                  rows={4}
                  variant="outlined"
                  onChange={handleDescChange}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Container>
      </div>
    </React.Fragment>
  );
}
