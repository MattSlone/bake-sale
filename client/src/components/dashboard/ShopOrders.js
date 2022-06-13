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

const PREFIX = 'Orders';

const classes = {
  seeMore: `${PREFIX}-seeMore`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(3)
}));

export default function ShopOrders(props) {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    props.getOrders({ forShop: true })
  }, [])

  useEffect(() => {
    if (props.order.orders) {
      setOrders(props.order.orders)
    }
  }, [props.order.loading])

  return (
    <Root>
      <Title>Orders</Title>
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
          {orders ? orders.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>Matt</TableCell>
              <RouterLink to={`/dashboard/orders/${row.id}`}>View Order</RouterLink>
            </TableRow>
          )) : ''}
        </TableBody>
      </Table>
    </Root>
  );
}
