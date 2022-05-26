import React from 'react';
import { styled } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

const PREFIX = 'Deposits';

const classes = {
  depositContext: `${PREFIX}-depositContext`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
  [`& .${classes.depositContext}`]: {
    flex: 1,
  },
});

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits() {

  return (
    <Root>
      <Title>Recent Deposits</Title>
      <Typography component="p" variant="h4">
        $3,024.00
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on 15 March, 2019
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </Root>
  );
}
