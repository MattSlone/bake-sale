import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { Input } from '@material-ui/core';
import { CardActionArea } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  cardGrid: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0,
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
    backgroundColor: 'lightgrey',
  },
  cardContent: {
    flexGrow: 1,
  },
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function AddProductImages(props) {
  const classes = useStyles();
  const hiddenFileInput = React.useRef([])

  const handleClick = (event, index) => {
    hiddenFileInput.current[index].click();
  };

  const handleChange = event => {
    let reader = new FileReader
    let file = event.target.files[0]

    if (file) {
      reader.onloadend = () => {
        props.setProductImagesPreview([...props.imageFiles, {
          file: file,
          imagePreviewUrl: reader.result
        }]);
      }

      reader.readAsDataURL(file)
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={1}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card elevation={0} className={classes.card}>
                  <CardActionArea onClick={event => handleClick(event, card)}>
                      <CardMedia
                        className={classes.cardMedia}
                        image={props.imageFiles[card-1] ? props.imageFiles[card-1].imagePreviewUrl : "/assets/images/add-image.png"}
                        title="Image title"
                      />
                    <Input type='file' style={{display: 'none'}} inputRef={el => hiddenFileInput.current[card] = el} onChange={handleChange}/>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}
