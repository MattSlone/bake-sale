import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/material/styles';
//import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import LabelFL from '../labels/FL'

const useStyles = makeStyles((theme) => ({
  root: {
      flexGrow: 1,
  },
  pdf: {
    flex: 1,
    height: 400
  }
}));

export default function PricingAndInventory() {
  const classes = useStyles();
  return (
    <Grid container spacing={2} className={classes.root}>
      <PDFViewer className={classes.pdf}>
        <LabelFL />
      </PDFViewer>
    </Grid>
  );
}
