import React, { useState, useEffect, useRef, useReducer } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useRouteMatch, useParams } from 'react-router-dom';
import { Input } from '@mui/material';
import { CardActionArea } from '@mui/material';
import axios from 'axios'
import Popover from '@mui/material/Popover';
import { useIsMount } from '../../hooks/useIsMount';

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
  const isMount = useIsMount()
  const { id } = useParams()
  const edit = match.path.includes('edit')
  const hiddenFileInput = useRef([])
  const [imageFiles, dispatchImageFiles] = useReducer(imageFilesReducer, { files: [] });
  const [deleteImageAnchor, setDeleteImageAnchor] = useState({
    element: null,
    index: 0
  });
  let deleteImageAnchorRef = useRef('')

  function imageFilesReducer(state, action) {
    return action.payload;
  }

  const handleDeleteImageClose = () => {
    setDeleteImageAnchor({
      element: null,
      index: 0
    })
  }

  const handleDeleteImage = () => {
    const newImageFiles = { files: [...imageFiles.files] }
    newImageFiles.files.splice(deleteImageAnchor.index-1, 1)
    dispatchImageFiles({ payload: newImageFiles })
    handleDeleteImageClose()
  }

  const validate = () => {
    let rtn = { error: '', success: false }
    if (imageFiles.files.length > 9) {
      rtn.error = "Products may have a maximum of 9 images."
      return rtn
    }
    if (!imageFiles.files.length >= 1 || !Object.keys(imageFiles.files[0]).length > 0) {
      rtn.error = "Products must have at least one image."
      return rtn
    }
    rtn.success = true
    return rtn
  }

  const open = Boolean(deleteImageAnchor.element);

  /**
   * Load Images
   */
  useEffect(() => {
    const getImages = async () => {
      if (!isMount && edit && props.product.productImages.length > 0) {
        const newImageFiles = await Promise.all(props.product.productImages.map(async image => {
          const res = await axios.get(`/api${image.path}`,{
            responseType: 'blob'
          })
          return {
            file: res.data,
            imagePreviewUrl: `/api${image.path}`
          }
        }))
        dispatchImageFiles({ payload: { files: newImageFiles } })
      } else if ((edit && isMount && props.product.id == id) || (!edit && !props.product.id)) {
        dispatchImageFiles({ payload: { files: props.product.imageFiles } })
      } else {
        dispatchImageFiles({ payload: { files: [] } })
      }
    }
    getImages()
  }, [props.product.productImages])

  useEffect(() => {
    const valid = validate()
    props.setValidProductImages(valid)
    if(valid.success) {
      props.setProductImagesPreview(imageFiles.files)
    }
  }, [imageFiles])

  const handleClick = (event, index) => {
    if (imageFiles.files[index-1]?.file) {
      setDeleteImageAnchor({
        element: event.currentTarget,
        index: index
      })
    } else {
      hiddenFileInput.current[index].click()
    }
  };

  const handleChange = (event, key) => {
    let reader = new FileReader
    let file = event.target.files[0]
    if (file) {
      // add image to preview box
      reader.onloadend = () => {
        dispatchImageFiles({ 
          payload: { files: [...imageFiles.files, {
            file: file,
            imagePreviewUrl: reader.result,
          }] }
        })
      }
      reader.readAsDataURL(file)
    } else {
      // remove current image if cancel
      let tempImageFiles = imageFiles.files.filter((file, i) => i !== key-1)
      dispatchImageFiles({ payload: { files: tempImageFiles } })
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
                        image={imageFiles.files[card-1]?.imagePreviewUrl ? imageFiles.files[card-1].imagePreviewUrl : "/assets/images/add-image.png"}
                        title="Image title"
                      />
                    <Input type='file' style={{display: 'none'}} inputRef={el => hiddenFileInput.current[card] = el} onChange={(e) => handleChange(e, card)}/>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Popover
            id={open ? 'delete-image-popover' : undefined}
            open={open}
            anchorEl={deleteImageAnchor.element}
            onClose={handleDeleteImageClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Button
              sx={{margin: '1em'}}
              variant="contained"
              onClick={handleDeleteImage}
            >
              Delete Image
            </Button>
          </Popover>
        </Container>
      </main>
    </Root>
  );
}
