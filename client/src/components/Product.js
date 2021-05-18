import { React, useState } from 'react';
import Carousel from 'react-material-ui-carousel'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
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
    <Container className={classes.cardGrid}>
      <Carousel>
        {
          items.map( (item, i) => <Item key={i} item={item} /> )
        }
      </Carousel>
      <Typography gutterBottom variant="h5" component="h2">
        {product.name}
      </Typography>
      <Typography>
        {product.description}
        {product.price}
      </Typography>
    </Container>
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