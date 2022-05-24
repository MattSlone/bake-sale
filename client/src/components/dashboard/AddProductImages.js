import React, { useState, useEffect } from 'react';
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
import { makeStyles } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { Input } from '@mui/material';
import { CardActionArea } from '@mui/material';

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

export default function AddProductImages({ imageFiles, setProductImagesPreview }) {
  const classes = useStyles();
  const hiddenFileInput = React.useRef([])

  console.log(imageFiles)

  const handleClick = (event, index) => {
    hiddenFileInput.current[index].click();
  };

  const handleChange = event => {
    let reader = new FileReader
    let file = event.target.files[0]

    if (file) {
      reader.onloadend = () => {
        setProductImagesPreview([...imageFiles, {
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
                        image={imageFiles[card-1] ? imageFiles[card-1].imagePreviewUrl : "/assets/images/add-image.png"}
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
