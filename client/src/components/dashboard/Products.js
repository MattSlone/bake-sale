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
    paddingBottom: theme.spacing(8),
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
  },

  [`& .${classes.routerLinkButton}`]: {
    textDecoration: 'none',
  }
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Products(props) {

  const [products, setProducts] = useState(props.product.products)
  const history = useHistory()

  if(!props.shop.id) {
    return <Redirect to="/dashboard/shop/create" />
  }

  useEffect(() => {
    props.getProducts({
      shop: props.shop.id
    })
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

  return (
    <StyledContainer spacing={2} className={classes.cardGrid} maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.card} onClick={handleAddProduct}>
            <CardMedia
              className={classes.cardMediaAdd}
              image="/assets/images/add-icon.png"
              title="Image title"
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.card} onClick={handleAddCustomProduct}>
            <CardMedia
              className={classes.cardMediaAdd}
              image="/assets/images/add-custom.png"
              title="Image title"
            />
          </Card>
        </Grid>
        {products ? products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                image={`/api/${product.ProductImages[0]?.path}`}
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
        )) : ''}
      </Grid>
    </StyledContainer>
  );
}
