import React, { useEffect } from 'react';
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
  [`& .${classes.root}`]: {
    margin: 'auto',
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
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function Ingredients({ ingredients, setIngredients }) {

  const [checked, setChecked] = React.useState([]);
  const [right, setRight] = React.useState(ingredients);
  const [left, setLeft] = React.useState([]);
  const [newIngredient, setNewIngredient] = React.useState('');

  // wait for setRight to update then create ingredients
  useEffect(() => {
    if(right) {
      setIngredients(right)
    }
  }, [right])

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
        newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
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
        <StyledGrid alignContent="center" container className={(classes.cardHeader, classes.cardHeaderEmpty)}>
          <Grid item>
            <Typography>
              Product Ingredients
            </Typography>
          </Grid>
        </StyledGrid>
      )
      }
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((item) => {
          const labelId = `transfer-list-all-item-${item.name}-label`;

          return (
            <ListItem key={item.name} role="listitem" button onClick={handleToggle(item, 3)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(item) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={item.name} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} direction="column" className={classes.root}>
      <Grid item>
        Please review all <a href="https://www.fdacs.gov/content/download/70108/file/Cottage-Food-Operations.pdf" target="_blank">labeling requirements (page 4)</a>. 
        If your product contains an allergen from the any of the following food groups: (milk, eggs, wheat, peanuts, soybeans, fish 
        (including shellfish, crab, lobster or shrimp) and tree nuts (such as almonds, pecans or walnuts),
        you must include the particular allergen in your ingredient list:

      </Grid>
      <Grid item>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid className={classes.flexGrow2} item>{customList('left', left)}</Grid>
          <Grid className={classes.flexGrow} item>
            <Grid container direction="column" alignItems="center">
              <Button
                variant="outlined"
                size="small"
                className={classes.button}
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                variant="outlined"
                size="small"
                className={classes.button}
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
            </Grid>
          </Grid>
          <Grid className={classes.flexGrow2} item>{customList('Chosen', right)}</Grid>
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
    </Grid>
  );
}
