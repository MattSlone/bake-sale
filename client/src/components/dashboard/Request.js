import { React, useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Carousel from 'react-material-ui-carousel'
import { useParams } from 'react-router-dom'
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal';

const PREFIX = 'Request';

const classes = {
  product: `${PREFIX}-product`,
  personalizationBox: `${PREFIX}-personalizationBox`,
  card: `${PREFIX}-card`,
  cardMedia: `${PREFIX}-cardMedia`,
  sidebar: `${PREFIX}-sidebar`,
  top: `${PREFIX}-top`,
  titles: `${PREFIX}-titles`,
  requestQuoteButton: `${PREFIX}-requestQuoteButton`,
  formControl: `${PREFIX}-formControl`,
  descTitle: `${PREFIX}-descTitle`
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const StyledPaper = styled(Paper)((
  {
    theme
  }
) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  marginTop: theme.spacing(10)
}));

export default function Request(props)
{

  let { id } = useParams()
  const [quote, setQuote] = useState(props.quote.quotes.find(quote => quote.id == id))
  const [price, setPrice] = useState(Number(quote.price).toFixed(2))
  const [open, setOpen] = useState(false);
  const [quoted, setQuoted] = useState(quote.QuoteStatusId != 1)
  console.log(quote)

  const handleSubmit = () => {
    props.setQuotePrice({
      price: price,
      QuoteId: quote.id
    })
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <StyledPaper>
      <Typography sx={{fontWeight: 'bold'}}>
        Quote Request: {quote.Product.name}
      </Typography>
      <List>
        {quote.Values ? quote.Values.map(value => (
          <ListItem key={value.id}>
            <ListItemText
              primary={value.value}
              secondary={value.Field.name}
            />
          </ListItem>
        )) : ''}
      </List>
      <Box sx={{display: 'flex', flexDirection: 'column', maxWidth: '200px'}}>
        <TextField
          variant="outlined"
          margin="normal"
          type="number"
          minimum={0}
          required
          id="price"
          label="Price"
          name="price"
          value={price}
          disabled={quoted}
          inputProps={ {inputMode: 'numeric', pattern: '[0-9]*', min: 0 } }
          autoFocus
          onChange={e => setPrice(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={quoted}
          className={classes.submit}
          onClick={e => handleOpen(e)}
        >
          {quoted ? 'Price Set' : 'Set Price'}
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style, width: 400 }}>
            <h2 id="parent-modal-title">Are you sure?</h2>
            <p id="parent-modal-description">
              {`By clicking confirm, the customer will be notified and will be able to purchase
              ${quote.Product.name} for $${price}. Only continue if you are ready to process the order.`}
            </p>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={e => handleSubmit(e)}
            >
              Confirm
            </Button>
          </Box>
        </Modal>
      </Box>
    </StyledPaper>
  )
}