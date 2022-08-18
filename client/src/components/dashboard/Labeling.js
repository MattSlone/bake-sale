import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { BlobProvider } from '@react-pdf/renderer';
import LabelFL from '../labels/FL'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { TextField, Typography } from '@mui/material';

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
      padding: theme.spacing(2)
  },
}));

export default function Labeling(props) {
  const [weight, setWeight] = useState(props.weight)

  const validate = () => {
    let rtn = { error: '', success: false }
    for (const field of [
      { name: 'Weight', value: weight }
    ]) {
      if (!field.value) {
        rtn.error = `${field.name} is required.`
        return rtn
      }
    }
    if (weight <= 0) {
      rtn.error = "Weight must be greater than 0."
      return rtn
    }
    rtn.success = true
    return rtn
  }

  useEffect(() => {
    const valid = validate()
    props.setValidLabeling(valid)
    if(valid.success) {
      props.setProductWeight(weight)
    }
  }, [weight])

  return (
    <StyledGrid container spacing={2} className={classes.root}>
      <Grid item xs={12}>
        <Typography>
          You can use the below label for your products, or create your own!
        </Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>
          Enter the net weight of the product in ounces. 
          This is the weight of an individually packaged product
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Net Weight"
          placeholder="1.4oz"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          type="number"
        />
      </Grid>
      <Grid item xs={12} className={classes.pdf}>
        <BlobProvider
          document={<LabelFL product={props.product} shop={props.shop} user={props.user}/>}
        >
          {({ blob, url, loading }) => {
            return loading ? 'loading...' : (
              <Document file={url}
                renderMode="canvas"
              >
                <Page
                  pageNumber={1}
                  width={document.getElementsByClassName('Labeling-pdf')[0]?.clientWidth*0.75}
                />
              </Document>
            );
          }}
        </BlobProvider>
      </Grid>
    </StyledGrid>
  );
}
