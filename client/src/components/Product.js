import { React, useState } from 'react';
import Carousel from 'react-material-ui-carousel'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';


const useStyles = makeStyles((theme) => ({
  product: {
    padding: theme.spacing(8),
    marginTop: theme.spacing(8)
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
    marginTop: 'auto'
  },
  addToCartButton: {
    width: '100%'
  },
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(1)
  },
  descriptionContainer: {
    marginTop: theme.spacing(1)
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
  const [product, setProduct] = useState(props.product.products.find(product => product.id == id))

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
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container direction="column"  justifyContent="space-between" className={classes.productAttributes}>
            <Grid item>
              <Typography gutterBottom variant="h7" component="h4">
                {props.shop.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="h5" component="h2">
                {product.name}
              </Typography>
            </Grid>
            <Grid item className={classes.addToCart}>
              <Typography gutterBottom variant="h4" component="h1">
                ${product.Varieties[0].price}
              </Typography>
            </Grid>
            <Grid item>
              <Grid container alignItems="stretch" direction="column">
                <Grid item xs={12}>
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="variation-label">Select an option</InputLabel>
                    <Select
                      labelId="variation-label"
                      id="variation-select"
                      label="Select an option"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {
                        product.Varieties.map( 
                          (variety, i) => <MenuItem key={i} value={variety.quantity}>{`Package of ${variety.quantity}, $${variety.price}`}</MenuItem> 
                        )
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                  className={classes.addToCartButton}
                  variant="contained"
                  color="primary"
                  >
                    Add to Cart
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className={classes.descriptionContainer}>
        <Typography className={classes.descTitle}>
          Description:
        </Typography>
        <Typography variant="body1">
          {product.description}
        </Typography>
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