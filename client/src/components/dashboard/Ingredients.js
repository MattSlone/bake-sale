import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import axios from 'axios'

const PREFIX = 'Ingredients';

const classes = {
  root: `${PREFIX}-root`,
  cardHeader: `${PREFIX}-cardHeader`,
  cardHeaderEmpty: `${PREFIX}-cardHeaderEmpty`,
  flexGrow: `${PREFIX}-flexGrow`,
  flexGrow2: `${PREFIX}-flexGrow2`,
  inlineFlex: `${PREFIX}-inlineFlex`,
  list: `${PREFIX}-list`,
  button: `${PREFIX}-button`
};

const StyledGrid = styled(Grid)((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'stretch'
    },
  },

  [`& .${classes.cardHeader}`]: {
    padding: theme.spacing(1, 2),
  },

  [`& .${classes.cardHeaderEmpty}`]: {
    height: 48,
    padding: theme.spacing(1, 2),
  },

  [`& .${classes.flexGrow}`]: {
    flex: 1
  },

  [`& .${classes.flexGrow2}`]: {
    flex: 2
  },

  [`& .${classes.inlineFlex}`]: {
    display: "inline-flex"
  },

  [`& .${classes.list}`]: {
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },

  [`& .${classes.button}`]: {
    margin: theme.spacing(0.5, 0),
  }
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1)
}

function unique(a) {
  return [...new Map(a.map(ingredient => [ingredient.name, ingredient])).values()]
}

export default function Ingredients({ ingredients, setIngredients, setValidIngredients }) {
  const [checked, setChecked] = useState([])
  const [right, setRight] = useState(ingredients)
  const [left, setLeft] = useState([])
  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)
  const [newIngredient, setNewIngredient] = useState('')


  const validate = () => {
    let rtn = { error: '', success: false }
    if (right.length <= 0) {
      rtn.error = "Products must have at least one ingredient."
      return rtn
    }
    rtn.success = true
    return rtn
  }

  /**
   * Populate the right list with the ingredients for the product being edited
   * (will be empty if new product)
   */
  useEffect(() => {
    const valid = validate()
    setValidIngredients(valid)
    if(valid.success) {
      setIngredients(right)
    }
  }, [right])

  /**
   * Get most recently added ingredients by the user
   */
  useEffect(async () => {
    const res = await axios.get('/api/ingredients')
    if(res.data.success) {
      setLeft(res.data.success)
    }
  }, [])

  /**
   * Search the users' previously used ingredients
   */
  useEffect(async () => {
    const params = { search: newIngredient.name }
    const res = await axios.get('/api/ingredients', {
      params
    })
    if(res.data.success) {
      setLeft(res.data.success)
    }
  }, [newIngredient])

  /**
   * Adds or removes an ingredient from the checked array
   * @param {Object} value 
   * @returns null
   */
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]
    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
        newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }

  /**
   * Moves ingredients that are checked on the left side to the right side
   */
  const moveLeftCheckedToRight = () => {
    setRight(unique(right.concat(leftChecked)))
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
  }

  /**
   * Moves ingredients that are checked on the right side to the left side
   */
  const moveRightCheckedToLeft = () => {
    setLeft(unique(left.concat(rightChecked)))
    setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
  };

  const searchIngredients = (e) => {
    const searchText = e.target.value
    const matched = left.filter(item => searchText.length > 0 && item.name.includes(searchText))
    const notMatched = left.filter(item => !matched.includes(item))
    reorderList(matched, notMatched)
    handleChecked(matched)

    if(matched.length === 0) {
      setNewIngredient({name: searchText, allergen: false})
    } else {
      setNewIngredient('')
    }
  }

  const addIngredient = () => {
    if (newIngredient.name.length > 0) {
      const newLeft = [...left]
      newLeft.unshift(newIngredient)
      setLeft(newLeft)
      handleChecked([newIngredient])
    }
  }

  const reorderList = (matched, notMatched) => {
    const newLeft = matched.concat(notMatched)
    setLeft(newLeft)
  }

  const handleChecked = (matched) => {
    const newChecked = matched
    setChecked(newChecked)
  }

  /**
   * Toggle the allergen flag on an ingredient
   */
  const handleAllergenButtonClick = () => {
    const newChecked = checked.map(ingredient => {
      return {
        ...ingredient,
        allergen: !ingredient.allergen
      }
    })
    const newLeft = left.filter(ingredient => !newChecked.map(ingredient => ingredient.name).includes(ingredient.name))
      .concat(newChecked.filter(ingredient => left.map(ingredient => ingredient.name).includes(ingredient.name)))
    const newRight = right.filter(ingredient => !newChecked.map(ingredient => ingredient.name).includes(ingredient.name)) 
      .concat(newChecked.filter(ingredient => right.map(ingredient => ingredient.name).includes(ingredient.name)))
    setChecked(newChecked)
    setLeft(newLeft)
    setRight(newRight)
    updateIngredients(newChecked)
  }

  const updateIngredients = async (ingredients) => {
    try {
      const res = await axios.post('/api/ingredients/update', {
        ingredients: ingredients
      })
      if (res.data.error) {
        console.log(res.data.error[0])
      } else {
        // that'll do donkey...that'll do
      }
    } catch (err) {
      console.log(err)
    }
  }

  const customList = (type, items) => (
    <Card>
      {type == 'left' ? (
      <div className={classes.inlineFlex}>
        <TextField
          placeholder="Search ingredients"
          className={classes.cardHeader}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={searchIngredients}
        />
        
        <IconButton color="primary" size="medium" onClick={addIngredient}><AddBoxIcon /></IconButton>
      </div>
      
      ) : (
        <Grid alignContent="center" container className={(classes.cardHeader, classes.cardHeaderEmpty)}>
          <Grid item>
            <Typography>
              Product Ingredients
            </Typography>
          </Grid>
        </Grid>
      )
      }
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((item) => {
          const labelId = `transfer-list-all-item-${item.name}-label`;

          return (
            <ListItem key={item.name} role="listitem" button onClick={handleToggle(item)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(item) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                disableTypography
                primary={<Typography style={{ color: item.allergen ? '#ff0000' : '#000000' }}>{item.name}</Typography>}
              />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <StyledGrid container spacing={2} direction="column" className={classes.root}>
      <Grid item>
        Please review all <a href="https://www.fdacs.gov/content/download/70108/file/Cottage-Food-Operations.pdf" target="_blank">labeling requirements (page 4)</a>. 
        If your product contains an allergen from any of the following food groups: (milk, eggs, wheat, peanuts, soybeans, fish 
        (including shellfish, crab, lobster or shrimp) and tree nuts (such as almonds, pecans or walnuts),
        you must include the particular allergen in your ingredient list. You can also use the 
        <span> <WarningAmberIcon style={{ verticalAlign: 'text-bottom'}}/></span> button below to 
        explicitly mark an ingredient as an allergen, and it will be included as such on the product label.
      </Grid>
      <Grid item>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid xs={12} md={5} item>{customList('left', left)}</Grid>
          <Grid xs={12} md={2} item>
            <Grid container direction="column" alignItems="center">
              <Button
                variant="outlined"
                className={classes.button}
                onClick={moveLeftCheckedToRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                <ArrowForwardIcon />
              </Button>
              <Button
                variant="outlined"
                className={classes.button}
                onClick={moveRightCheckedToLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                <ArrowBackIcon />
              </Button>
              <Button
                variant="outlined"
                className={classes.button}
                color="red"
                disabled={rightChecked.length === 0 && leftChecked.length === 0}
                onClick={handleAllergenButtonClick}
              >
                <WarningAmberIcon />
              </Button>
            </Grid>
          </Grid>
          <Grid xs={12} md={5} item>{customList('Chosen', right)}</Grid>
        </Grid>
      </Grid>
      <Grid item>
        {/*<Grid container>
          <Grid item>

          </Grid>
          <Grid item>

          <FormControlLabel
            control={
              <Checkbox
                checked={state.checkedB}
                onChange={handleChange}
                name="checkedB"
                color="primary"
              />
            }
            label="Primary"
          />
          </Grid>
        </Grid>*/}
      </Grid>
    </StyledGrid>
  );
}
