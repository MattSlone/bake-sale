import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { TextField } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import isByteLength from 'validator/lib/isByteLength';

const PREFIX = 'ListingDetails';

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  formControl: `${PREFIX}-formControl`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
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

  [`& .${classes.formControl}`]: {
    width: '100%'
  }
}));

export default function ListingDetails(props) {
  const [name, setName] = useState(props.name)
  const [description, setDescription] = useState(props.description)
  const [category, setCategory] = useState(props.category)
  const [processingTime, setProcessingTime] = useState(props.processingTime)

  const validate = () => {
    let rtn = { error: '', success: false }
    for (const field of [
      { name: 'Title', value: name },
      { name: 'Description', value: description },
      { name: 'Category', value: category },
      { name: 'Processing Time', value: processingTime }
    ]) {
      if (!field.value) {
        rtn.error = `${field.name} is required.`
        return rtn
      }
    }
    if (!isByteLength(name, { max: 140 })) {
      rtn.error = "Product names may have a max of 140 characters."
      return rtn
    }
    if (!isByteLength(name, { max: 2000 })) {
      rtn.error = "Descriptions may have a max of 2000 characters."
      return rtn
    }
    rtn.success = true
    return rtn
  }

  useEffect(() => {
    const valid = validate()
    props.setValidListingDetails(valid)
    if(valid.success) {
      props.setListingDetails({
        name: name,
        description: description,
        category: category,
        processingTime: processingTime
      })
    }
  }, [name, description, category, processingTime])

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
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
    <Root>
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
                  <MenuItem value={''}>Select</MenuItem>
                  <MenuItem value={'breadandpastries'}>Bread &amp; Pastries</MenuItem>
                  <MenuItem value={'cakesandcupcakes'}>Cakes &amp; Cupcakes</MenuItem>
                  <MenuItem value={'cookies'}>Cookies</MenuItem>
                  <MenuItem value={'candyandchocolate'}>Candy &amp; Chocolate</MenuItem>
                  <MenuItem value={'piesandtarts'}>Pies &amp; Tarts</MenuItem>
                  <MenuItem value={'honeyandjams'}>Honey &amp; Jams</MenuItem>
                  <MenuItem value={'fruitsandnuts'}>Fruits &amp; Nuts</MenuItem>
                  <MenuItem value={'herbsandspices'}>Herbs &amp; Spices</MenuItem>
                  <MenuItem value={'other'}>Other</MenuItem>
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
    </Root>
  );
}
