import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { useHistory, Link as RouterLink, Redirect } from "react-router-dom";

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
  },
  cardMediaAdd: {
    paddingTop: '56.25%', // 16:9
    height: '100%',
    cursor: 'pointer'
  },
  cardContent: {
    flexGrow: 1,
  },
  routerLinkButton: {
    textDecoration: 'none',
  }
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Products(props) {
  const classes = useStyles();
  const [products, setProducts] = useState(props.product.products)
  const history = useHistory()

  if(!props.shop.id) {
    return <Redirect to="/dashboard/shop/create" />
  }

  useEffect(() => {
    props.getProducts({
      shop: props.shop.id
    })

    setProducts(props.product.products)
  }, [])

  const handleAddProduct = () => {
    history.push('/dashboard/products/add')
  }

  return (
    <Container spacing={2} className={classes.cardGrid} maxWidth="lg">
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                image="https://source.unsplash.com/featured/?baked,goods"
                title="Image title"
              />
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography>
                  {product.description}
                  {product.price}
                </Typography>
              </CardContent>
              <CardActions>
                <RouterLink to={`/products/${product.id}`}>
                  <Button size="small" color="primary">
                    View
                  </Button>
                </RouterLink>
                <RouterLink to={`/dashboard/products/${product.id}/edit`}>
                  <Button size="small" color="primary">
                    Edit
                  </Button>
                </RouterLink>
              </CardActions>
            </Card>
          </Grid>
        ))}
        <Grid item key={products[products.length - 1].id} xs={12} sm={6} md={4}>
          <Card className={classes.card} onClick={handleAddProduct}>
            <CardMedia
              className={classes.cardMediaAdd}
              image="/assets/images/add-icon.png"
              title="Image title"
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
