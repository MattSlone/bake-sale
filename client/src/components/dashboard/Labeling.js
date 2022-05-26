import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
//import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import LabelFL from '../labels/FL'

const PREFIX = 'Labeling';

const classes = {
  root: `${PREFIX}-root`,
  pdf: `${PREFIX}-pdf`
};

const StyledGrid = styled(Grid)((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
      flexGrow: 1,
  },

  [`& .${classes.pdf}`]: {
    flex: 1,
    height: 400
  }
}));

export default function PricingAndInventory() {

  return (
    <StyledGrid container spacing={2} className={classes.root}>
      <PDFViewer className={classes.pdf}>
        <LabelFL />
      </PDFViewer>
    </StyledGrid>
  );
}
