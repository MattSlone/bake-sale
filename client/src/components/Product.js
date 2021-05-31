import { React, useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../hooks/use-auth'
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { TextField, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  product: {
    padding: theme.spacing(8),
    marginTop: theme.spacing(8)
  },
  personalizationBox: {
    width: '100%',
    marginBottom: theme.spacing(1)
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  productAttributes: {
    height: '100%'
  },
  addToCart: {
    //marginTop: 'auto'
  },
  addToCartButton: {
    width: '100%'
  },
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(1)
  },
  descriptionContainer: {
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      display: "none"
    },
  },
  descriptionContainerBottom: {
    display: "none",
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      display: "block"
    },
  },
  descTitle: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1)
  }
}));



export default function Product(props)
{
  const classes = useStyles()
  let { id } = useParams()
  const auth = useAuth()
  const [product, setProduct] = useState(props.product.products.find(product => product.id == id))
  const [shop, setShop] = useState(props.shop)
  const [variation, setVariation] = useState(1)
  const [personalization, setPersonalization] = useState('')
  const [fulfillment, setFulfillment] = useState('')
  const [price, setPrice] = useState(Number.parseFloat(product.Varieties[0].price).toFixed(2))
  const [addonsChecked, setAddonsChecked] = useState(Object.fromEntries(
    product.Addons.map(addon => [addon.name, false])
  ));

  const handleAddonCheckChange = (event) => {
    setAddonsChecked({ ...addonsChecked, [event.target.name]: event.target.checked });
  };

  useEffect(() => {
    handleSetPrice()
  }, [variation, fulfillment, addonsChecked])

  useEffect(() => {
    props.getShop({id: product.ShopId})
  }, [])

  const handleSetPrice = () => {
    let selectedVariation = product.Varieties.find(v => v.quantity == variation)
    let total = selectedVariation.price

    let addonsTotal = 0.0

    product.Addons.forEach((addon) => {
      if(addonsChecked[addon.name]) {
        addonsTotal += addon.price
        addonsTotal += addon.secondaryPrice * (variation-1)
      }
    })

    total += addonsTotal

    let fulfillmentPrice = 0.0
    if (fulfillment == 'delivery') {
      fulfillmentPrice = selectedVariation.delivery
    } else if(fulfillment == 'shipping') {
      fulfillmentPrice = selectedVariation.shipping
    }

    total += fulfillmentPrice

    setPrice(Number.parseFloat(total).toFixed(2))
  }

  const handleAddToCart = () => {
    props.addToCart({
      product: product,
      personalization: personalization,
      variation: variation,
      fulfillment: fulfillment,
      addons: addonsChecked,
      clientSidePrice: price,
      quantity: 1
    })
  }

  const handleSelectVariation = (e) => {
    setVariation(e.target.value)
    setFulfillment('')
  }

  const handleSelectFulfillment = (e) => {
    setFulfillment(e.target.value)
  }

  const handlePersonalizationChange = (e) => {
    setPersonalization(e.target.value)
  }

  var items = [
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!"
    },
    {
      name: "Random Name #2",
      description: "Hello World!"
    }
  ]

  return (
    <Paper className={classes.product}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}> 
          <Carousel
          indicators={false}
          >
            {
              items.map( (item, i) => <Item key={i} item={item} /> )
            }
          </Carousel>
          <DescriptionContainer product={product} classProp={classes.descriptionContainer} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container direction="column" className={classes.productAttributes}>
            <Grid item>
              <Typography gutterBottom variant="h6" component="h4">
                {props.shop.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="h5" component="h2">
                {product.name}
              </Typography>
            </Grid>
            <Grid item className={classes.addToCart}>
              <Typography gutterBottom>
                {product.Addons.sort((a,b) => a.id - b.id).map((addon, i) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={addonsChecked[addon.name]}
                        name={addon.name}
                        color="primary"
                        onChange={handleAddonCheckChange}
                      />
                    }
                    label={`${addon.name} ($${addon.price.toFixed(2)}${addon.secondaryPrice > 0 ? ` + $${addon.secondaryPrice.toFixed(2)}`: ""})`}
                  />
                ))}
              </Typography>
            </Grid>
            {product.personalizationPrompt.length > 0 ? 
            <>
            <Grid item>
              <Typography gutterBottom variant="body1">
                Personalization: {product.personalizationPrompt}
              </Typography>
            </Grid>
            <Grid item>
            <TextField
              className={classes.personalizationBox}
              value={personalization}
              id="outlined-multiline-static"
              label="Personalize your order"
              multiline
              rows={4}
              variant="outlined"
              onChange={handlePersonalizationChange}
            />
            </Grid>
            </>
            : ''}
            <Grid item>
              <Typography gutterBottom variant="h4" component="h1">
                ${price}
              </Typography>
            </Grid>
            <Grid item>
              <Grid container alignItems="stretch" direction="column">
                <Grid item xs={12}>
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="variation-label">Variation</InputLabel>
                    <Select
                      labelId="variation-label"
                      id="variation-select"
                      label="Select an option"
                      value={variation}
                      onChange={handleSelectVariation}
                    >
                      {
                        product.Varieties.sort((a, b) => a.quantity - b.quantity).map( 
                          (variety, i) => <MenuItem key={i} value={variety.quantity}>{`Package of ${variety.quantity}, $${Number.parseFloat(variety.price).toFixed(2)}`}</MenuItem> 
                        )
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="variation-label">Fulfillment Type</InputLabel>
                    <Select
                      labelId="variation-label"
                      id="variation-select"
                      label="Select an option"
                      value={fulfillment}
                      onChange={handleSelectFulfillment}
                    >
                      <MenuItem value=''>Select an option</MenuItem>
                      {props.shop.pickupAddress.street ? <MenuItem value='pickup'>Pickup</MenuItem> : ""}
                      {
                        (product.Varieties.find(v => v.quantity == variation).delivery > 0) ? 
                        <MenuItem value='delivery'>{`Delivery, $${Number.parseFloat(product.Varieties.find(v => v.quantity == variation).delivery).toFixed(2)}`}</MenuItem>
                        : ""
                      }
                      {
                        (product.Varieties.find(v => v.quantity == variation).shipping) ? 
                        <MenuItem value='shipping'>{`Shipped, $${Number.parseFloat(product.Varieties.find(v => v.quantity == variation).shipping).toFixed(2)}`}</MenuItem>
                        : ""
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                  className={classes.addToCartButton}
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <DescriptionContainer product={product} classProp={classes.descriptionContainerBottom} />
      </Grid>
      
      
    </Paper>
  )
}

function Item(props)
{
  const classes = useStyles()
    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image="https://source.unsplash.com/featured/?baked,goods"
          title="Image title"
        />
      </Card>
    )
}

function DescriptionContainer({product, classProp}) {
  const classes = useStyles()
  return (
    <Grid direction="column" spacing={2} container className={classProp}>
      <Grid item>
        <Typography className={classes.descTitle}>
          Description:
        </Typography>
        <Typography variant="body1">
          {product.description}
        </Typography>
      </Grid>
      <Grid item>
        <Typography className={classes.descTitle}>
          Processing Time:
        </Typography>
        <Typography variant="body1">
          {product.processingTime} days
        </Typography>
      </Grid>
    </Grid>
  )
}