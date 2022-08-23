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
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useHistory, Link as RouterLink, useParams } from "react-router-dom";

const PREFIX = 'Shop';

const classes = {
  cardGrid: `${PREFIX}-cardGrid`,
  card: `${PREFIX}-card`,
  cardMedia: `${PREFIX}-cardMedia`,
  cardMediaAdd: `${PREFIX}-cardMediaAdd`,
  cardContent: `${PREFIX}-cardContent`,
  routerLinkButton: `${PREFIX}-routerLinkButton`,
  header: `${PREFIX}-header`,
  headerImage: `${PREFIX}-headerImage`,
  headerOverlay: `${PREFIX}-headerOverlay`,
  headerOverlayTop: `${PREFIX}-headerOverlayTop`,
  infoBox: `${PREFIX}-infoBox`,
  shopOptionsIcon: `${PREFIX}-shopOptionsIcon`
};

const StyledContainer = styled(Container)((
  {
    theme
  }
) => ({
  [`& .${classes.cardGrid}`]: {
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

  [`& .${classes.cardContent}`]: {
    flexGrow: 1,
    padding: theme.spacing(1),
    "&:last-child": {
      paddingBottom: 0
    }
  },

  [`& .${classes.routerLinkButton}`]: {
    textDecoration: 'none',
  },

  [`& .${classes.header}`]: {
    marginTop: theme.spacing(2),
    height: '50%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },

  [`& .${classes.headerImage}`]: {
    paddingTop: '28.125%', // 16:9
  },

  [`& .${classes.headerOverlay}`]: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.54)',
    color: 'white',
    padding: '1em',
  },

  [`& .${classes.headerOverlayTop}`]: {
    position: 'absolute',
    top: 0,
    right: 0,
  },

  [`& .${classes.infoBox}`]: {
    padding: '1em',
    marginTop: '1em'
  },

  [`& .${classes.shopOptionsIcon}`]: {
    visibility: 'hidden',
    opacity: 0,
    transition: 'visibility 0s, opacity 0.5s linear',
    color: 'white',
    margin: '1em',
    backgroundColor: 'rgba(0, 0, 0, 0.54)'
  },
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Shop(props) {
  let { id } = useParams()

  const [products, setProducts] = useState(props.product.products)
  const [shop, setShop] = useState(props.shop)
  const history = useHistory()

  useEffect(() => {
    props.getProducts({
      shopName: id
    })
  }, [])

  useEffect(() => {
    if (!props.product.loading) {
      setProducts(props.product.products)
    }
  }, [props.product.loading])

  return (
    <StyledContainer>
      <Header title={shop.name} />
      <Paper className={classes.infoBox}>
        <Typography variant="body1">
          {shop.description}
        </Typography>
      </Paper>
      <Container disableGutters spacing={2} className={classes.cardGrid} maxWidth="lg">
        <Grid container spacing={4}>
          {products.map((card) => (
            <Grid item key={card.id} xs={12} sm={6} md={4}>
              <RouterLink className={classes.routerLinkButton} to={`/products/${card.id}`}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={`/api${card.ProductImages[0]?.path}`}
                  />
                  <CardContent noGutter className={classes.cardContent}>
                    <Typography noWrap gutterBottom variant="h5" component="h5">
                      {card.name}
                    </Typography>
                    <Typography noWrap gutterBottom variant="p" component="p">
                      {card.description}
                    </Typography>
                  </CardContent>
                </Card>
              </RouterLink>
            </Grid>
          ))}
        </Grid>
      </Container>
    </StyledContainer>
  );

  
}

function Header({title})
{
  const [headerHovered, setHeaderHovered] = useState(false)
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
          {/*<Fab style={fabDisplay} className={classes.shopOptionsIcon} aria-label="settings">
            <MoreVertIcon />
          </Fab>*/}
        </div>
        <CardMedia
          className={classes.headerImage}
          image="https://source.unsplash.com/featured/?baked,goods"
          title={title}
        />
        <div className={classes.headerOverlay}>
          <Typography variant="h5">{title}</Typography>
        </div>
      </Card>
    )
}