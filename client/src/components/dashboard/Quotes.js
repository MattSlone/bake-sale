import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Title from './Title';
import { Link as RouterLink } from 'react-router-dom'

const PREFIX = 'Ouotes';

const classes = {
  seeMore: `${PREFIX}-seeMore`,
  row: `${PREFIX}-row`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  padding: theme.spacing(2),

  [`& .${classes.row}`]: {
    overflowX: 'auto',
  }
}));

export default function Quotes(props) {
  const [quotes, setQuotes] = useState([])

  useEffect(() => {
    props.getQuotes({ forShop: true })
  }, [])

  useEffect(() => {
    if (props.quote.quotes) {
      setQuotes(props.quote.quotes)
    }
  }, [props.quote.loading])

  return (
    <Root>
      <Title>Requests</Title>
      <Grid container direction='column'>
        <Grid item xs={12}>
          <Grid spacing={1} container>
            {['Date', 'Product', 'Customer', ''].map(name => 
              <Grid item xs={3}>
                <span style={{fontWeight: 'bold'}}>{name}</span>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Divider />
        {quotes.length > 0 ? quotes.map((row) => (
          <>
          <Grid item xs={12}>
            <Grid spacing={1} container direction='row'>
              <Grid className={classes.row} item xs={3}>{row.createdAt}</Grid>
              <Grid className={classes.row} item xs={3}>{row.Product.name}</Grid>
              <Grid className={classes.row} item xs={3}>{`${row.User.firstName} ${row.User.lastName}`}</Grid>
              <Grid className={classes.row} item xs={3}><RouterLink to={`/dashboard/requests/${row.id}`}>View Order</RouterLink></Grid>
            </Grid>
          </Grid>
          <Divider />
          </>
        )) : ''}
      </Grid>
    </Root>
  );
}
