import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { CardContent, TextField, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useRouteMatch } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker as DatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns as DateAdapter } from '@mui/x-date-pickers/AdapterDateFns';

const PREFIX = 'CustomProductForm';

const classes = {
  card: `${PREFIX}-card`,
  cardContent: `${PREFIX}-cardContent`,
  formControl: `${PREFIX}-formControl`,
  textField: `${PREFIX}-textField`,
  paper: `${PREFIX}-paper`,
  noshadow: `${PREFIX}-noshadow`,
  nopadding: `${PREFIX}-nopadding`
};

const StyledPaper = styled(Paper)((
  {
    theme
  }
) => ({
  padding: theme.spacing(1),
  paddingTop: theme.spacing(3),
  minHeight: 400,
  boxShadow: 'none',

  [`& .${classes.card}`]: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },

  [`& .${classes.cardContent}`]: {
    flexGrow: 1,
  },

  [`& .${classes.formControl}`]: {
    minWidth: 200,
  },

  [`& .${classes.textField}`]: {
    minWidth: 200
  },

  [`& .${classes.paper}`]: {
    padding: theme.spacing(1),
    paddingTop: theme.spacing(3),
    minHeight: 400,
  },

  [`& .${classes.noshadow}`]: {
    boxShadow: 'none'
  },

  [`& .${classes.nopadding}`]: {
    padding: 0
  }
}));


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CustomProductForm({fields, setFields = null, title, noshadow, }) {

  const [formTitle, setFormTitle] = useState(title)

  const handleValueChange = (newValue, index) => {
    let newFields = [...fields]
    newFields[index].value = newValue
    setFields(newFields)
  }

  const handleDeleteField = (i) => {
    let newFields = fields.filter((field, j) => j !== i)
    setFields(newFields)
  }

  const match = useRouteMatch()

  const renderField = (field, index) => {
    switch(field.type) {
      case 'text':
      case 'number':
      case 'paragraph':
        return (
          <Card className={noshadow ? `${classes.noshadow} ${classes.card}` : classes.card}>
            <CardContent className={noshadow ? `${classes.nopadding} ${classes.cardContent}` : classes.cardContent}>
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
            <DeleteButton title={title} index={index} handleDeleteField={handleDeleteField}/>
          </Card>
        );
      case 'select':
        return (
          <Card className={noshadow ? `${classes.noshadow} ${classes.card}` : classes.card}>
            <CardContent className={noshadow ? `${classes.nopadding} ${classes.cardContent}` : classes.cardContent}>
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
            <DeleteButton title={title} index={index} handleDeleteField={handleDeleteField}/>
          </Card>
        );
      case 'multiselect':
        return (
          <Card className={noshadow ? `${classes.noshadow} ${classes.card}` : classes.card}>
            <CardContent className={noshadow ? `${classes.nopadding} ${classes.cardContent}` : classes.cardContent}>
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
            <DeleteButton title={title} index={index} handleDeleteField={handleDeleteField}/>
          </Card>
        );
      case 'date':
        return (
          <Card className={noshadow ? `${classes.noshadow} ${classes.card}` : classes.card}>
            <CardContent className={noshadow ? `${classes.nopadding} ${classes.cardContent}` : classes.cardContent}>
              <Typography gutterBottom>
                {field.prompt}
              </Typography>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <DatePicker
                  label={field.name}
                  format="MM/dd/yyyy"
                  value={field.value}
                  onChange={(newValue) => handleValueChange(newValue, index)}
                  renderInput={(params) => <TextField {...params} />}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </LocalizationProvider>
            </CardContent>
            <DeleteButton title={title} index={index} handleDeleteField={handleDeleteField}/>
          </Card>
        );
      default: 
        return
    }
  }

  return (
    <StyledPaper className={noshadow ? `${classes.paper} ${classes.noshadow}` : classes.paper}>
      <Typography gutterBottom variant="h4">
        {formTitle}
      </Typography>
      <Grid spacing={2} container direction="column">
      {fields.map((field, index) => {
        return !field.deleted ? (
          <Grid item key={index} xs={12}>
            {renderField(field, index)}
          </Grid>
        ) : ''
      })}
      </Grid>
    </StyledPaper>
  );
}

function DeleteButton({ title, index, handleDeleteField }) {
  return ( title === 'Form Preview' &&
    <Grid container justifyContent="flex-end">
      <IconButton
        edge="start"
        aria-label="delete"
        onClick={() => {handleDeleteField(index)}}
        size="large">
        <DeleteIcon />
      </IconButton>
    </Grid>
  )
}
