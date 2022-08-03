import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link'
import { Redirect, useLocation, Link as RouterLink } from "react-router-dom";
import axios from 'axios'
import isByteLength from 'validator/lib/isByteLength';

const PREFIX = 'Maintenance';

const classes = {
};

const StyledBox = styled(Box)((
  {
    theme
  }
) => ({
  padding: theme.spacing(2)
}));

export default function Maintenance() {
  return (
    <StyledBox>
      <Typography>
        Under Construction. <RouterLink to="/signup">Sign up</RouterLink> to be notified when we are close to launch.
      </Typography>
    </StyledBox>
  );
}
