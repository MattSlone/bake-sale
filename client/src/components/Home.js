import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { Link as RouterLink } from "react-router-dom";
import Pagination from '@mui/material/Pagination'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Bake.$ale
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Home(props) {
  const [count, setCount] = useState(props.product.count)
  const [lastId, setLastId] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    props.getProducts({ lastId: lastId })
    props.getProductsCount()
  }, [])

  useEffect(() => {
    if (props.product.loading == false) {
      console.log(props.product.count)
      console.log('getting products...')
    }
  }, [props.product.loading])

  const handleChangePage = function(event, value) {
    const page = value
    const lastId = (page-1) * 6
    props.getProducts({ lastId: lastId })
    setPage(page)
  }

  const PREFIX = 'Home';

  const classes = {
    icon: `${PREFIX}-icon`,
    heroContent: `${PREFIX}-heroContent`,
    heroButtons: `${PREFIX}-heroButtons`,
    cardGrid: `${PREFIX}-cardGrid`,
    card: `${PREFIX}-card`,
    cardMedia: `${PREFIX}-cardMedia`,
    cardContent: `${PREFIX}-cardContent`,
    footer: `${PREFIX}-footer`,
    routerLinkButton: `${PREFIX}-routerLinkButton`,
    routerLink: `${PREFIX}-routerLink`
  };

  // TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
  const Root = styled('div')((
    {
      theme,
    }
  ) => ({
    padding: theme.spacing(2),
    [`& .${classes.icon}`]: {
      marginRight: theme.spacing(2),
    },

    [`& .${classes.heroContent}`]: {
      backgroundColor: theme.palette.background.paper,
    },

    [`& .${classes.heroButtons}`]: {
      marginBottom: theme.spacing(4),
    },

    [`& .${classes.cardGrid}`]: {
      padding: 0,
      paddingTop: (userdata) => theme.spacing(parseInt(`${userdata.loggedIn ? 0 : 8}`)),
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

    [`& .${classes.footer}`]: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(6),
    },

    [`& .${classes.routerLinkButton}`]: {
      textDecoration: 'none',
    },

    [`& .${classes.routerLink}`]: {
      textDecoration: 'none',
    }
  }));

  const WelcomeHeader = () => (
    <>
    <Typography variant="h5" align="center" color="textSecondary" paragraph>
      Buy and sell baked goods and other food from the comfort of your home!
      Did you know 49 out of the 50 states
      have <Link href="https://foodpreneurinstitute.com/cottage-food-law/">cottage food laws</Link> governing
      the sale of homemade food? We streamlined the process to make it easy
      for home chefs. All that's left to do is order what looks good!
    </Typography>
    <div className={classes.heroButtons}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <RouterLink to='/signin' className={classes.routerLinkButton}>
              <Button variant="contained" color="primary">
              Sign In
            </Button>
          </RouterLink>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="primary">
            How it works
          </Button>
        </Grid>
      </Grid>
    </div>
    </>
  )

  return ( 
    <Root>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            {props.userData.loggedIn ? null : <WelcomeHeader />}
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="lg">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {props.product.products ? props.product.products.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <RouterLink className={classes.routerLink} to={`/products/${card.id}`}>
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
            )) : ''}
            <Grid item xs={12} container justifyContent="center">
              <Pagination count={Math.ceil(props.product.count / 6)} page={page} color="primary" onChange={handleChangePage} />
            </Grid>
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </Root>
  );
}
