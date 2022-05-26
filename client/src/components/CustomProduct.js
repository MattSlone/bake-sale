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
  descTitle: `${PREFIX}-descTitle`
};

const StyledCard = styled(Card)((
  {
    theme
  }
) => ({
  [`& .${classes.product}`]: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(8)
  },

  [`& .${classes.personalizationBox}`]: {
    width: '100%',
    marginBottom: theme.spacing(1)
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
  const [quote, setQuote] = useState(props.quote.quotes.find(quote => quote.ProductId == id))
  const [fields, setFields] = useState([])
  const [product, setProduct] = useState('')

  useEffect(() => {
    props.getProducts({products: [id]})
  }, [])

  useEffect(() => {
    let tempProduct = props.product.products.find(product => product.id == id)
    if (tempProduct) {
      setProduct(tempProduct)
      setFields(tempProduct.fields)
    }
  }, [props.product.loading])

  const handleRequestQuote = () => {
    props.requestQuote({
      ...quote,
      productId: product.id,
      status: 'requested',
      values: mapValuesToFields()
    })
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
      <Grid container spacing={3} className={classes.top}>
        <Grid item xs={12} md={8}> 
          <Carousel
          indicators={false}
          >
            {
              items.map( (item, i) => <Item key={i} item={item} /> )
            }
          </Carousel>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid item container className={classes.sidebar} justifyContent="flex-start" direction="column">
            <Grid item>
              <Typography gutterBottom variant="h6" component="h4">
                {props.shop.name}
              </Typography>
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
              <Button
              className={classes.requestQuoteButton}
              variant="contained"
              color="primary"
              onClick={handleRequestQuote}
              >
                {(quote && quote.status == 'requested') ? "Requested!" : "Request a Quote"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid>
        <CustomProductForm fields={fields} setFields={setFields} title="Questions" noshadow />
      </Grid>
      
    </Paper>
  )
}

function Item(props)
{

    return (
      <StyledCard className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          image="https://source.unsplash.com/featured/?baked,goods"
          title="Image title"
        />
      </StyledCard>
    );
}