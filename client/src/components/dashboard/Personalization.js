import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Input, TextField, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

const PREFIX = 'Personalization';

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  fullWidth: `${PREFIX}-fullWidth`,
  tooltip: `${PREFIX}-tooltip`
};

const StyledGrid = styled(Grid)((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
      flexGrow: 1,
  },

  [`& .${classes.paper}`]: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },

  [`& .${classes.fullWidth}`]: {
    width: '100%'
  },

  [`& .${classes.tooltip}`]: {
    fontSize: theme.typography.pxToRem(48),
  }
}));

export default function Personalization(props) {


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
    <StyledGrid container spacing={2} direction="column">
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
    </StyledGrid>
  );
}
