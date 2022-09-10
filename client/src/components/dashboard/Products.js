import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import axios from 'axios'
import { useHistory, Link as RouterLink, Redirect } from "react-router-dom";

const PREFIX = 'Products';

const classes = {
  cardGrid: `${PREFIX}-cardGrid`,
  card: `${PREFIX}-card`,
  cardMedia: `${PREFIX}-cardMedia`,
  cardMediaAdd: `${PREFIX}-cardMediaAdd`,
  cardContent: `${PREFIX}-cardContent`,
  routerLinkButton: `${PREFIX}-routerLinkButton`
};

const StyledContainer = styled(Container)((
  {
    theme
  }
) => ({
  [`&.${classes.cardGrid}`]: {
    paddingTop: theme.spacing(2),
  },

  [`& .${classes.card}`]: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  [`& .${classes.cardMedia}`]: {
    paddingTop: '56.25%', // 16:9
  },

  [`& .${classes.cardMediaAdd}`]: {
    paddingTop: '56.25%', // 16:9
    height: '100%',
    cursor: 'pointer'
  },

  [`& .${classes.cardContent}`]: {
    flexGrow: 1,
    maxWidth: '300px',
  },

  [`& .${classes.routerLinkButton}`]: {
    textDecoration: 'none',
  }
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const ACTIVE_SHOP_STATUS = 1

export default function Products(props) {

  const [products, setProducts] = useState(props.product.products)
  const [message, setMessage] = useState('')
  const history = useHistory()

  if(!props.shop.id) {
    return <Redirect to="/dashboard/shop/create" />
  }

  useEffect(() => {
    props.resetProduct()
    props.getProducts({
      shop: props.shop.id
    })
    if (props.shop.status !== ACTIVE_SHOP_STATUS) {
      setMessage(
        'Your products will not be visible to customers until you\'ve created \
        a payment account.'
      )
    }
  }, [])

  useEffect(() => {
    if (props.product.loading == false) {
      setProducts(props.product.products)
    }
  }, [props.product.loading])

  const handleAddProduct = () => {
    history.push('/dashboard/products/add')
  }

  const handleAddCustomProduct = () => {
    history.push('/dashboard/products/add-custom')
  }

  const handleTogglePublish = async (productId) => {
    try {
      const res = await axios.get(`/api/product/publish/toggle`, {
        params: {
          productId: productId
        }
      })
      if (res.data.error) {
        console.log(res.data.error)
        return
      }
      props.getProducts({
        shop: props.shop.id
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <StyledContainer spacing={2} className={classes.cardGrid} maxWidth="lg">
      {message ?
        <Typography style={{marginBottom: '1em', color: 'red'}}>
          {message}
        </Typography>
      : ''}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.card} onClick={handleAddProduct}>
            <CardMedia
              className={classes.cardMediaAdd}
              image="/assets/images/add-icon.png"
              title="Add product"
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.card} onClick={handleAddCustomProduct}>
            <CardMedia
              className={classes.cardMediaAdd}
              image="/assets/images/add-custom.png"
              title="Add custom product"
            />
          </Card>
        </Grid>
        {products ? products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <RouterLink to={`/products/${product.id}`}>
                <CardMedia
                  className={classes.cardMedia}
                  image={`/api${product.ProductImages[0]?.path}`}
                  title={product.name}
                />
              </RouterLink>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography noWrap>
                  {product.description}
                  {product.price}
                </Typography>
              </CardContent>
              <CardActions>
                <RouterLink className={classes.routerLinkButton} to={`/dashboard/products/${product.id}/edit`}>
                  <Button size="small" color="primary">
                    Edit
                  </Button>
                </RouterLink>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleTogglePublish(product.id)}
                >
                  {product.published ? 'Unpublish' : 'Publish'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )) : ''}
      </Grid>
    </StyledContainer>
  );
}
