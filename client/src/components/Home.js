import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { useHistory, Link as RouterLink } from "react-router-dom";
import { store } from '../redux/store'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Bake.$ales
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Home({ userData }) {

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
    routerLinkButton: `${PREFIX}-routerLinkButton`
  };

  // TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
  const Root = styled('div')((
    {
      theme,
    }
  ) => ({
    [`& .${classes.icon}`]: {
      marginRight: theme.spacing(2),
    },

    [`& .${classes.heroContent}`]: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(8, 0, 0),
    },

    [`& .${classes.heroButtons}`]: {
      marginBottom: theme.spacing(4),
    },

    [`& .${classes.cardGrid}`]: {
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
    },

    [`& .${classes.footer}`]: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(6),
    },

    [`& .${classes.routerLinkButton}`]: {
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
    <Root userdata={userData}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Bake.$ale
            </Typography>
            {userData.loggedIn ? null : <WelcomeHeader />}
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="lg">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/featured/?baked,goods"
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Heading
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe the content.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      View
                    </Button>
                    <Button size="small" color="primary">
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
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
