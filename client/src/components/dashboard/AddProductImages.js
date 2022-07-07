import React, { useState, useEffect } from 'react';
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
import { useRouteMatch } from 'react-router-dom';
import { Input } from '@mui/material';
import { CardActionArea } from '@mui/material';
import axios from 'axios'

const PREFIX = 'AddProductImages';

const classes = {
  icon: `${PREFIX}-icon`,
  cardGrid: `${PREFIX}-cardGrid`,
  card: `${PREFIX}-card`,
  cardMedia: `${PREFIX}-cardMedia`,
  cardContent: `${PREFIX}-cardContent`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.icon}`]: {
    marginRight: theme.spacing(2),
  },

  [`& .${classes.cardGrid}`]: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },

  [`& .${classes.card}`]: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0,
  },

  [`& .${classes.cardMedia}`]: {
    paddingTop: '56.25%', // 16:9
    backgroundColor: 'lightgrey',
  },

  [`& .${classes.cardContent}`]: {
    flexGrow: 1,
  }
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function AddProductImages(props) {
  const match = useRouteMatch()
  const edit = match.path.includes('edit')
  const hiddenFileInput = React.useRef([])
  const [imageFiles, setImageFiles] = useState([])

  useEffect(async () => {
    if (edit) {
      setImageFiles(
        await Promise.all(props.product.ProductImages.map(async image => {
          const res = await axios.get(`/api${image.path}`, { responseType: 'blob' })
          return {
            file: res.data,
            imagePreviewUrl: `/api${image.path}`
          }
        }))
      )
    }
  }, [])

  useEffect(() => {
    console.log(imageFiles)
    props.setProductImagesPreview(imageFiles)
  }, [imageFiles])

  const handleClick = (event, index) => {
    hiddenFileInput.current[index].click();
  };

  const handleChange = (event, key) => {
    let reader = new FileReader
    let file = event.target.files[0]

    if (file) {
      reader.onloadend = () => {
        setImageFiles([...imageFiles, {
          file: file,
          imagePreviewUrl: reader.result,
        }]);
      }
      reader.readAsDataURL(file)
    } else {
      let tempImageFiles = imageFiles.filter((file, i) => i !== key-1)
      console.log(tempImageFiles)
      setImageFiles(tempImageFiles)
    }
  };

  return (
    <Root>
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
                        image={imageFiles[card-1]?.imagePreviewUrl ? imageFiles[card-1].imagePreviewUrl : "/assets/images/add-image.png"}
                        title="Image title"
                      />
                    <Input type='file' style={{display: 'none'}} inputRef={el => hiddenFileInput.current[card] = el} onChange={(e) => handleChange(e, card)}/>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </Root>
  );
}
