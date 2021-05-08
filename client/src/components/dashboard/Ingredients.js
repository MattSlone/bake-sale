import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'stretch'
    },
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  cardHeaderEmpty: {
    height: 48,
  },
  flexGrow: {
    flex: 1
  },
  flexGrow2: {
    flex: 2
  },
  inlineFlex: {
    display: "inline-flex"
  },
  list: {
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },

}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function Ingredients({ ingredients, setIngredients }) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(['google', 'amazon', 'amazing', 'microsoft', 'netflix']);
  const [right, setRight] = React.useState(ingredients);
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
    const matched = left.filter(item => searchText.length > 0 && item.includes(searchText))
    const notMatched = left.filter(item => !matched.includes(item))
    reorderList(matched, notMatched)
    handleChecked(matched)

    if(matched.length === 0) {
      setNewIngredient(searchText)
    } else {
      setNewIngredient('')
    }
  }

  const addIngredient = () => {
    if (newIngredient.length > 0) {
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
        <div className={classes.cardHeader, classes.cardHeaderEmpty} />
      )
      }
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value, 3)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`List item ${value + 1}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
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
  );
}
