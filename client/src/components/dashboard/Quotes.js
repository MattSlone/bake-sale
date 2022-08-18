import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { Link as RouterLink } from 'react-router-dom'

const PREFIX = 'Ouotes';

const classes = {
  seeMore: `${PREFIX}-seeMore`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  padding: theme.spacing(2)
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
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {quotes ? quotes.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>{row.Product.name}</TableCell>
              <TableCell>Matt</TableCell>
              <TableCell><RouterLink to={`/dashboard/requests/${row.id}`}>View Request</RouterLink></TableCell>
            </TableRow>
          )) : ''}
        </TableBody>
      </Table>
    </Root>
  );
}
