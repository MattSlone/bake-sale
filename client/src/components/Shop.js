import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useHistory, Link as RouterLink, useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
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
  },
  header: {
    marginTop: theme.spacing(8),
    height: '50%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  headerImage: {
    paddingTop: '28.125%', // 16:9
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.54)',
    color: 'white',
    padding: '1em',
  },
  headerOverlayTop: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  infoBox: {
    padding: '1em',
    marginTop: '1em'
  },
  shopOptionsIcon: {
    visibility: 'hidden',
    opacity: 0,
    transition: 'visibility 0s, opacity 0.5s linear',
    color: 'white',
    margin: '1em',
    backgroundColor: 'rgba(0, 0, 0, 0.54)'
  }
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Shop(props) {
  let { id } = useParams()
  const classes = useStyles();
  const [products, setProducts] = useState(props.product.products)
  const [shop, setShop] = useState(props.shop)
  const history = useHistory()

  useEffect(() => {
    props.getProducts({
      shop: id
    })

    setProducts(props.product.products)
  }, [])

  return (
    <Container>
      <Header title={shop.name} />
      <Paper className={classes.infoBox}>
        <Typography variant="body1">
          {shop.description} Testing shop description
        </Typography>
      </Paper>
      <Container disableGutters spacing={2} className={classes.cardGrid} maxWidth="lg">
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
                  <RouterLink to={product.custom ? `/products/custom/${product.id}` : `/products/${product.id}`}>
                    <Button size="small" color="primary">
                      View
                    </Button>
                  </RouterLink>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Container>
  );

  
}

function Header({title})
{
  const [headerHovered, setHeaderHovered] = useState(false)

  const classes = useStyles()
  const fabDisplay = headerHovered ? {
    visibility: 'visible',
    opacity: 1
    } : {};
    return (
      <Card className={classes.header}
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
      >
        <div className={classes.headerOverlayTop}>
          <Fab style={fabDisplay} className={classes.shopOptionsIcon} aria-label="settings">
            <MoreVertIcon />
          </Fab>
        </div>
        <CardMedia
          className={classes.headerImage}
          image="https://source.unsplash.com/featured/?baked,goods"
          title="Image title"
        />
        <div className={classes.headerOverlay}>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body2">Pies &amp; Cakes</Typography>
        </div>
      </Card>
    )
}