import { React, useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Carousel from 'react-material-ui-carousel'
import { useParams } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import CustomProductForm from './CustomProductForm';
import { TextField, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { Link } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios'

const PREFIX = 'CustomProduct';

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
  descTitle: `${PREFIX}-descTitle`,
  link: `${PREFIX}-link`
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

  [`& .${classes.link}`]: {
    textDecoration: 'none',
    color: 'black'
  },


  [`&.${classes.card}`]: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  [`& .${classes.cardMedia}`]: {
    paddingTop: '56.25%', // 16:9
  },

  [`& .${classes.sidebar}`]: {
    height: '100%'
  },

  [`& .${classes.top}`]: {
    // flexWrap: 'nowrap'
  },

  [`& .${classes.titles}`]: {
    marginBottom: 'auto'
  },

  [`& .${classes.requestQuoteButton}`]: {
    width: '100%',
    marginTop: '5px'
  },

  [`& .${classes.formControl}`]: {
    width: '100%',
    marginBottom: theme.spacing(1)
  },

  [`& .${classes.descTitle}`]: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1)
  }
}));

export default function CustomProduct(props)
{
  let { id } = useParams()
  const auth = useAuth()
  const [quote, setQuote] = useState(props.quote.quotes.filter(quote => quote.ProductId == id)[props.quote.quotes.length-1])
  const [fields, setFields] = useState([])
  const [requested, setRequested] = useState(quote && quote.QuoteStatusId == '1')
  const [product, setProduct] = useState('')
  const [message, setMessage] = useState('')
  const [fulfillment, setFulfillment] = useState('')
  const [deliveryCost, setDeliveryCost] = useState(0)
  const [miles, setMiles] = useState(0)

  const validate = () => {
    let rtn = { error: '', success: false }
    for (const field of [
      { name: 'Fulfillment', value: fulfillment },
      ...fields
    ]) {
      if (!field.value && !field.deleted) {
        rtn.error = `${field.name} is required.`
        return rtn
      }
    }
    rtn.success = true
    return rtn
  }

  useEffect(() => {
    props.getProducts({products: [id]})
  }, [])

  useEffect(() => {
    setQuote(props.quote.quotes.filter(quote => quote.ProductId == id)[props.quote.quotes.length-1])
  }, [props.quote.quotes])

  useEffect(() => {
    setRequested(quote && quote.QuoteStatusId == '1')
  }, [quote])

  useEffect(() => {
    let tempProduct = props.product.products.find(product => product.id == id)
    if (tempProduct) {
      setProduct(tempProduct)
      setFields(tempProduct.fields)
    }
  }, [props.product.loading])

  useEffect(() => {
    if (product) {
      getDeliveryByTheMileCost()
    }
  }, [product])

  const handleRequestQuote = () => {
    const valid = validate()
    if (valid.success) {
      props.requestQuote({
        ...quote,
        fulfillment: fulfillment,
        productId: product.id,
        values: mapValuesToFields()
      })
      setMessage('You\'ll receive an email with a final price once your quote has been processed')
    } else {
      setMessage(valid.error)
    }
  }
  const handleSelectFulfillment = (e) => {
    setFulfillment(e.target.value)
  }

  const mapValuesToFields = () => {
    const values = fields.map(field => {
      return {
        FieldId: field.id,
        value: field.value
      }
    })
    return values
  }

  const getDeliveryByTheMileCost = (async () => {
    if (product.Varieties.find(v => v.quantity == 1).deliveryFeeType == 'mile') {
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
      setDeliveryCost(product.Varieties.find(v => v.quantity == 1).delivery)
    }
  })

  return ( product ?
    <StyledPaper className={classes.product}>
      <Grid container spacing={3} className={classes.top}>
        <Grid item xs={12} md={8}> 
          <Carousel
            indicators={false}
          >
            {
              product.ProductImages?.map( (item, i) => <Item product={product} key={i} item={item} /> )
            }
          </Carousel>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid item container className={classes.sidebar} justifyContent="flex-start" direction="column">
            <Grid item>
              <Link to={`/shop/${product.Shop.id}`}>
                <Typography gutterBottom variant="h6" component="h4">
                  {product.Shop.name}
                </Typography>
              </Link>
            </Grid>
            <Grid item className={classes.titles}>
              <Typography gutterBottom variant="h5" component="h2">
                {product.name}
              </Typography>
            </Grid>
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
            <Grid item>
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
                  {props.shop.pickupAddress ? <MenuItem value='pickup'>Pickup</MenuItem> : ""}
                  {
                    (product.Varieties.find(v => v.quantity == 1).delivery > 0) &&
                    <MenuItem value='delivery'>
                      {`Delivery, $${Number.parseFloat(deliveryCost).toFixed(2)}\
                        ${miles > 0 ? `(${Number.parseFloat(miles).toFixed(1)} mi)`: ''}`}
                    </MenuItem>
                  }
                  {
                    (product.Varieties.find(v => v.quantity == 1).shipping) && 
                    <MenuItem value='shipping'>
                      {`Shipped, $${Number.parseFloat(product.Varieties.find(v => v.quantity == 1).shipping).toFixed(2)}`}
                    </MenuItem>
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Typography style={{color: 'red'}}>
                {message}
              </Typography>
            </Grid>
            <Grid item>
              <Button
              className={classes.requestQuoteButton}
              variant="contained"
              disabled={requested}
              color="primary"
              onClick={handleRequestQuote}
              >
                {requested ? "Requested!" : "Request a Quote"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid>
        <CustomProductForm fields={fields} setFields={setFields} title="Questions" noshadow />
      </Grid>
    </StyledPaper>
    : ''
  )
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