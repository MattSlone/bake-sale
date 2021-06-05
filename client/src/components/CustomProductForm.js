import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { CardContent, TextField, Typography } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardContent: {
    flexGrow: 1,
  },
  formControl: {
    minWidth: 200,
  },
  textField: {
    minWidth: 200
  },
  paper: {
    padding: theme.spacing(1),
    paddingTop: theme.spacing(3),
    minHeight: 400,
  }
}));


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CustomProductForm({fields, setFields}) {
  const classes = useStyles();

  const handleValueChange = (newValue, index) => {
    console.log(newValue)
    let newFields = [...fields]
    newFields[index].value = newValue
    setFields(newFields)
  }

  const handleDeleteField = (i) => {
    let newFields = fields.filter((field, j) => j !== i)
    setFields(newFields)
  }

  const renderField = (field, index) => {
    switch(field.type) {
      case 'text':
      case 'number':
      case 'paragraph':
        return (
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom>
                {field.prompt}
              </Typography>
              <TextField
                label={field.name}
                variant="outlined"
                className={classes.textField}
                value={field.value}
                type={field.type}
                multiline={field.type == 'paragraph'}
                rows={field.type == 'paragraph' ? 4 : 1}
                style={field.type == 'paragraph' ? {width: '100%'} : {}}
                InputProps={{inputProps: {
                  min:field.constraints.min ? field.constraints.min : '', 
                  max:field.constraints.max ? field.constraints.max : ''}}}
                onChange={(e) => handleValueChange(e.target.value, index)}
              />
            </CardContent>
            <Grid container justify="flex-end">
              <IconButton
                edge="start" 
                aria-label="delete"
                onClick={() => {handleDeleteField(index)}}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Card>
        )
      case 'select':
        return (
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom>
                {field.prompt}
              </Typography>
              <FormControl className={classes.formControl} variant="outlined">
                <InputLabel id={`${field.name}-label`}>{field.name}</InputLabel>
                <Select
                  labelId={`${field.name}-label`}
                  label={field.name}
                  value={field.value}
                  onChange={(e) => handleValueChange(e.target.value, index)}
                >
                  {field.options.map(optionName => (
                    <MenuItem value={optionName}>{optionName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
            <Grid container justify="flex-end">
              <IconButton
                edge="start" 
                aria-label="delete"
                onClick={() => {handleDeleteField(index)}}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Card>
        )
      case 'multiselect':
        return (
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom>
                {field.prompt}
              </Typography>
              <Autocomplete
                multiple
                id={field.name}
                options={field.options}
                value={field.value}
                onChange={(e, newValue) => handleValueChange(newValue, index)}
                disableCloseOnSelect
                getOptionLabel={(option) => option}
                renderOption={(option, { selected }) => (
                  <React.Fragment>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option}
                  </React.Fragment>
                )}
                style={{ width: 500 }}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label={field.name} />
                )}
              />
            </CardContent>
            <Grid container justify="flex-end">
              <IconButton
                edge="start" 
                aria-label="delete"
                onClick={() => {handleDeleteField(index)}}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Card>
        )
      default: 
        return
    }
  }

  return (
    <Paper className={classes.paper}>
      <Typography gutterBottom variant="h4">
        Form Preview
      </Typography>
      <Grid spacing={2} container direction="column">
      {fields.map((field, index) => {
        return (
          <Grid item key={index} xs={12}>
            {renderField(field, index)}
          </Grid>
        )
      })}
      </Grid>
    </Paper>
  );
}
