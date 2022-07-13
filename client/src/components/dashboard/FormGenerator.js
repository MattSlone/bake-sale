import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import CustomProductForm from '../CustomProductForm';

const PREFIX = 'FormGenerator';

const classes = {
  formControl: `${PREFIX}-formControl`,
  textField: `${PREFIX}-textField`,
  inline: `${PREFIX}-inline`
};

const StyledGrid = styled(Grid)((
  {
    theme
  }
) => ({
  [`& .${classes.formControl}`]: {
    minWidth: 200,
  },

  [`& .${classes.textField}`]: {
    minWidth: 200
  },

  [`& .${classes.inline}`]: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    flexWrap: 'wrap'
  }
}));

export default function FormGenerator(props) {

  const [fields, setFields] = useState(props.fields)
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [prompt, setPrompt] = useState('')
  const [option, setOption] = useState('')
  const [options, setOptions] = useState([])
  const [constraints, setConstraints] = useState({})

  useEffect(() => {
    console.log(fields)
    props.setCustomForm(fields)
  }, [fields])

  

  const handleCreateField = () => {
    let newFields = [...fields]
    newFields.push({
      name: name,
      type: type,
      prompt: prompt,
      value: (type == 'multiselect') ? [] : (type == 'date') ? Date.now() : '',
      options: options,
      constraints: constraints
    })
    setFields(newFields)
    setName('')
    setType('')
    setPrompt('')
    setOptions([])
    setConstraints({})
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handleTypeChange = (e) => {
    setType(e.target.value)
  }

  const handlePromptChange = (e) => {
    setPrompt(e.target.value)
  }

  const handleOptionChange = (e) => {
    setOption(e.target.value)
  }

  const handleCreateOption = () => {
    let newOptions = [...options]
    newOptions.push(option)
    setOptions(newOptions)
    setOption('')
  }

  const handleMinMaxChange = (e, minMax) => {
    setConstraints({
      ...constraints,
      [minMax]: e.target.value
    })
  }

  const handleDeleteOption = (i) => {
    let newOptions = options.filter((option, j) => j !== i)
    setOptions(newOptions)
  }

  return (
    <StyledGrid item spacing={2} container>
      <Grid item>
        <Grid spacing={2} item container direction="column">
          <Grid item>
            <Typography>
              Create a custom form.
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              label="Name"
              variant="outlined"
              value={name}
              onChange={handleNameChange}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Question / Prompt"
              variant="outlined"
              value={prompt}
              onChange={handlePromptChange}
            />
          </Grid>
          <Grid item container spacing={1}>
            <Grid item>
            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel id="type-select-label">Type</InputLabel>
              <Select
                labelId="type-select-label"
                id="type-select"
                label="Type"
                value={type}
                onChange={handleTypeChange}
              >
                <MenuItem value={'text'}>Text</MenuItem>
                <MenuItem value={'paragraph'}>Paragraph</MenuItem>
                <MenuItem value={'number'}>Number</MenuItem>
                <MenuItem value={'date'}>Date</MenuItem>
                <MenuItem value={'select'}>Select</MenuItem>
                <MenuItem value={'multiselect'}>Select Multiple</MenuItem>
              </Select>
            </FormControl>
            </Grid>
            {type == "number" ? 
            <Grid item container spacing={1}>
              <Grid item>
                <TextField
                  label="min"
                  onChange={(e) => handleMinMaxChange(e, 'min')}
                  variant="outlined"
                  type="number"
                />
              </Grid>
              <Grid item>
                <TextField
                  label="max"
                  variant="outlined"
                  onChange={(e) => handleMinMaxChange(e, 'max')}
                  type="number"
                />
              </Grid>
            </Grid> : ''}
            {['select', 'multiselect'].includes(type) ? 
            <Grid item container spacing={1} direction="column">
              <Grid spacing={1} item container alignItems="center">
                <Grid item>
                  <TextField
                    label="Option"
                    value={option}
                    onChange={handleOptionChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={handleCreateOption}
                  >
                    Create Option
                  </Button>
                </Grid>
              </Grid>
              <Grid item container>
              <List dense className={classes.inline}>
                {options.map((optionName, i) => (
                  <ListItem key={i}>
                    <ListItemText>
                      {optionName}
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {handleDeleteOption(i)}}
                        size="large">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              </Grid>
            </Grid>
            : ''}
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={handleCreateField}
            >
              Create Field
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <CustomProductForm setFields={setFields} fields={fields} title="Form Preview" />
      </Grid>
    </StyledGrid>
  );
}
