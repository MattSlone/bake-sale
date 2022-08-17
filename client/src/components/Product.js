import { React, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { styled } from '@mui/material/styles';
import Carousel from 'react-material-ui-carousel'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomProductContainer from './containers/CustomProductContainer'
import Checkbox from '@mui/material/Checkbox';
import { TextField, Typography } from '@mui/material';
import isByteLength from 'validator/lib/isByteLength';
import axios from 'axios'

const PREFIX = 'Product';

const classes = {
  product: `${PREFIX}-product`,
  personalizationBox: `${PREFIX}-personalizationBox`,
  card: `${PREFIX}-card`,
  cardMedia: `${PREFIX}-cardMedia`,
  productAttributes: `${PREFIX}-productAttributes`,
  addToCart: `${PREFIX}-addToCart`,
  addToCartButton: `${PREFIX}-addToCartButton`,
  formControl: `${PREFIX}-formControl`,
  descriptionContainer: `${PREFIX}-descriptionContainer`,
  descriptionContainerBottom: `${PREFIX}-descriptionContainerBottom`,
  descTitle: `${PREFIX}-descTitle`
};

const StyledPaper = styled(Paper)((
  {
    theme
  }
) => ({
  padding: theme.spacing(2),

  [`& .${classes.personalizationBox}`]: {
    width: '100%',
    marginBottom: theme.spacing(1)
  },

  [`& .${classes.card}`]: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  [`& .${classes.cardMedia}`]: {
    paddingTop: '56.25%', // 16:9
  },

  [`& .${classes.productAttributes}`]: {
    height: '100%'
  },

  [`& .${classes.addToCart}`]: {
    //marginTop: 'auto'
  },

  [`& .${classes.addToCartButton}`]: {
    width: '100%'
  },

  [`& .${classes.formControl}`]: {
    width: '100%',
    marginBottom: theme.spacing(1)
  },

  [`& .${classes.descriptionContainer}`]: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      display: "none"
    },
  },

  [`& .${classes.descriptionContainerBottom}`]: {
    display: "none",
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      display: "block"
    },
  },

  [`& .${classes.descTitle}`]: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1)
  }
}));

const StyledGrid = styled(Grid)((
  {
    theme
  }
) => ({
  [theme.breakpoints.down('md')]: {
    marginLeft: theme.spacing(2),
  },
  [`& .${classes.descriptionContainer}`]: {
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      display: "none"
    },
  },

  [`& .${classes.descriptionContainerBottom}`]: {
    display: "none",
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      display: "block"
    },
  },

  [`& .${classes.descTitle}`]: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1)
  }
}));



export default function Product(props)
{
  let { id } = useParams()
  const auth = useAuth()
  const [product, setProduct] = useState('')
  const [shop, setShop] = useState(props.shop)
  const [variation, setVariation] = useState('')
  const [personalization, setPersonalization] = useState('')
  const [fulfillment, setFulfillment] = useState('')
  const [price, setPrice] = useState(0)
  const [fulfillmentPrice, setFulfillmentPrice] = useState(0)
  const [secondaryFulfillmentPrice, setSecondaryFulfillmentPrice] = useState(0)
  const [addonsChecked, setAddonsChecked] = useState([]);
  const [deliveryCost, setDeliveryCost] = useState(0)
  const [miles, setMiles] = useState(0)

  const [message, setMessage] = useState('')

  useEffect(() => {
    props.getProducts({products: [id]})
  }, [id])

  useEffect(() => {
    let tempProduct = props.product.products.find(product => product.id == id)
    if (tempProduct) {
      setProduct(tempProduct)
      if (!tempProduct.custom) {
        console.log(tempProduct.ShopId)
        props.getShop({id: tempProduct.ShopId})
        setVariation(tempProduct.Varieties[0].quantity)
        setPrice(Number.parseFloat(tempProduct.Varieties[0].price).toFixed(2))
        setAddonsChecked(Object.fromEntries(
          tempProduct.Addons.map(addon => [addon.id, false])
        ))
      }
    }
  }, [props.product.loading])

  const validate = () => {
    let rtn = { error: '', success: false }
    for (const field of [
      { name: 'Variation', value: variation },
      { name: 'Fulfillment', value: fulfillment }
    ]) {
      if (!field.value) {
        rtn.error = `${field.name} is required.`
        return rtn
      }
    }
    if (!isByteLength(name, { max: 2000 })) {
      rtn.error = "Personalization may have a max of 2000 characters."
      return rtn
    }
    rtn.success = true
    return rtn
  }

  const handleAddonCheckChange = (event) => {
    setAddonsChecked({ ...addonsChecked, [event.target.id]: event.target.checked });
  };

  useEffect(() => {
    if (product && !product.custom) {
      handleSetPrice()
      getDeliveryByTheMileCost()
    }
  }, [product, variation, fulfillment, addonsChecked])

  const handleSetPrice = async () => {
    const item = {
      product: product,
      personalization: personalization,
      variation: variation,
      fulfillment: fulfillment,
      addons: addonsChecked,
      quantity: 1
    }
    const res = await axios.post('/api/product/price', item)
    if(res.data.error) {
      console.log(res.data.error)
    } else {
      const prices = res.data.success
      setPrice(Number(prices.productPrice + prices.fulfillmentPrice).toFixed(2))
      setFulfillmentPrice(prices.fulfillmentPrice)
      setSecondaryFulfillmentPrice(prices.secondaryFulfillmentPrice)
    }
  }

  const handleAddToCart = () => {
    setMessage('')
    const valid = validate()
    if (valid.success) {
      props.addToCart({
        product: product,
        personalization: personalization,
        variation: variation,
        fulfillment: fulfillment,
        addons: addonsChecked,
        productPrice: price - fulfillmentPrice,
        fulfillmentPrice: fulfillmentPrice,
        secondaryFulfillmentPrice: secondaryFulfillmentPrice,
        quantity: 1
      })
    } else {
      setMessage(valid.error)
    }
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

  const getDeliveryByTheMileCost = (async () => {
    if (product.Varieties.find(v => v.quantity == variation).deliveryFeeType == 'mile') {
      const res = await axios.get('/api/product/deliverycost', {
        params: {
          productId: product.id,
          quantity: 1
        }
      })
      if(res.data.error) {
        console.log(res.data.error)
      } else {
        console.log(res.data.success.miles)
        setDeliveryCost(res.data.success.cost)
        setMiles(res.data.success.miles)
      }
    } else {
      setDeliveryCost(product.Varieties.find(v => v.quantity == variation).delivery)
    }
  })

  return product ? (product.custom ? <CustomProductContainer /> :
    <StyledPaper className={classes.product}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}> 
          <Carousel
          indicators={false}
          >
            {
              product.ProductImages?.map( (item, i) => <Item product={product} key={i} item={item} /> )
            }
          </Carousel>
          <DescriptionContainer product={product} classProp={classes.descriptionContainer} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container direction="column" className={classes.productAttributes}>
            <Grid item>
              <Link to={`/shop/${product.Shop.id}`}>
                <Typography gutterBottom variant="h6" component="h4">
                  {product.Shop.name}
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="h5" component="h2">
                {product.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography gutterBottom>
                {product.Addons.sort((a,b) => a.id - b.id).map((addon, i) => (
                  <FormControlLabel
                    key={i}
                    control={
                      <Checkbox
                        checked={addonsChecked[addon.name]}
                        name={addon.name}
                        id={`${addon.id}`}
                        color="primary"
                        onChange={handleAddonCheckChange}
                      />
                    }
                    label={`${addon.name} ($${Number(addon.price).toFixed(2)}${Number(addon.secondaryPrice) > 0 ? ` + $${Number(addon.secondaryPrice).toFixed(2)} each additional item`: ""})`}
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
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}>
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
                <Grid item>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}>
                    <InputLabel id="variation-label">Fulfillment Type</InputLabel>
                    <Select
                      labelId="variation-label"
                      id="variation-select"
                      label="Select an option"
                      value={fulfillment}
                      onChange={handleSelectFulfillment}
                    >
                      <MenuItem value=''>Select an option</MenuItem>
                      {props.shop.pickupAddress ? <MenuItem value='pickup'>Pickup</MenuItem> : ""}
                      {
                        (product.Varieties.find(v => v.quantity == variation).delivery > 0) && 
                        <MenuItem value='delivery'>
                          {`Delivery, $${Number.parseFloat(deliveryCost).toFixed(2)}\
                            ${miles > 0 ? `(${Number.parseFloat(miles).toFixed(1)} mi)`: ''}\
                              + $${Number.parseFloat(product.Varieties.find(v => v.quantity == variation).secondaryDelivery).toFixed(2)}\
                               each additional item`}
                        </MenuItem>
                      }
                      {
                        (product.Varieties.find(v => v.quantity == variation).shipping) ? 
                        <MenuItem value='shipping'>
                          {`Shipped, $${Number.parseFloat(product.Varieties.find(v => v.quantity == variation).shipping).toFixed(2)}\
                           + $${Number.parseFloat(product.Varieties.find(v => v.quantity == variation).secondaryShipping).toFixed(2)}\
                         each additional item`}
                        </MenuItem>
                        : ""
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <Typography style={{ color: 'red' }}>
                    {message}
                  </Typography>
                </Grid>
                <Grid item>
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
    </StyledPaper>)
  : '';
}

function Item(props)
{
    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image={`/api${props.item.path}`}
          title={props.product.name}
        />
      </Card>
    )
}

function DescriptionContainer({product, classProp}) {

  return (
    <StyledGrid direction="column" spacing={2} container className={classProp}>
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
    </StyledGrid>
  )
}