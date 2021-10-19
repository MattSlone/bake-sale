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
import CustomProductForm from './CustomProductForm';
import Checkbox from '@material-ui/core/Checkbox';
import { TextField, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  product: {
    padding: theme.spacing(2),
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
  sidebar: {
    height: '100%'
  },
  top: {
    // flexWrap: 'nowrap'
  },
  titles: {
    marginBottom: 'auto'
  },
  requestQuoteButton: {
    width: '100%',
    marginTop: '5px'
  },
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(1)
  },
  descTitle: {
    fontWeight: 'bold',
    marginRight: theme.spacing(1)
  }
}));



export default function CustomProduct(props)
{
  const classes = useStyles()
  let { id } = useParams()
  const auth = useAuth()
  const [product, setProduct] = useState(props.product.products.find(product => product.id == id))
  const [fields, setFields] = useState(props.fields)

  useEffect(() => {
    props.setCustomForm(fields)
  }, [fields])

  useEffect(() => {
    props.getShop({id: product.ShopId})
  }, [])

  const handleRequestQuote = () => {
    props.requestQuote({
      product: product
    })
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
                Request a Quote
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid>
        <CustomProductForm fields={product.fields} setFields={setFields} title="Questions" noshadow />
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