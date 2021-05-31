import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Input, TextField, Typography } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  root: {
      flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  fullWidth: {
    width: '100%'
  },
  tooltip: {
    fontSize: theme.typography.pxToRem(48),
  }
}));

export default function Personalization(props) {
  const classes = useStyles();

  const [personalizationPrompt, setPersonalizationPrompt] = useState(props.personalizationPrompt)
  const [personalization, setPersonalization] = useState(personalizationPrompt ? true : false)

  useEffect(() => {
    if(personalizationPrompt) {
      personalization ? props.setPersonalizationPrompt(personalizationPrompt) : props.setPersonalizationPrompt('')
    }
  }, [personalization, personalizationPrompt])

  const handlePersonalizationCheckboxChange = (event) => {
    setPersonalization(event.target.checked);
  };

  const handlePersonalizationPromptChange = (event) => {
    if(event.target.value == '') {
      setPersonalization(false)
    }
    setPersonalizationPrompt(event.target.value);
  };

  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        <Typography>
          Would you like to add a personalization option for your product?
          <Checkbox
            checked={personalization}
            onChange={handlePersonalizationCheckboxChange}
            name="checked"
            color="primary"
          />
        </Typography>
      </Grid>
      {personalization ? 
      <>
      <Grid item>
        <Typography>
          Let your customers know what features they can personalize and any additional information they need to provide:
        </Typography>
      </Grid>
      <Grid item xs={12} md={8}>
      <TextField
        className={classes.fullWidth}
        value={personalizationPrompt}
        id="outlined-multiline-static"
        label="Prompt"
        multiline
        rows={4}
        variant="outlined"
        onChange={handlePersonalizationPromptChange}
      />
      </Grid>
      </>
      : ''}
    </Grid>
  );
}
