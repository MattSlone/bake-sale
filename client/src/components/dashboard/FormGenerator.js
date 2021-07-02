import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CustomProductForm from '../CustomProductForm';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 200,
  },
  textField: {
    minWidth: 200
  },
  inline: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    flexWrap: 'wrap'
  }
}));

export default function FormGenerator(props) {
  const classes = useStyles();
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
    <Grid item spacing={2} container>
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
                      >
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
        <CustomProductForm setFields={setFields} fields={fields} />
      </Grid>
    </Grid>
  );
}
