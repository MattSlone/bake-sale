import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { Link as RouterLink, useHistory } from "react-router-dom";
import Pagination from '@mui/material/Pagination'
import { Divider, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useIsMount } from '../hooks/useIsMount';
import { useAuth } from '../hooks/use-auth'
import FormHelperText from '@mui/material/FormHelperText';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker as DatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns as DateAdapter } from '@mui/x-date-pickers/AdapterDateFns';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://bake.sale/">
        Bake.Sale
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 2,
  pb: 2,
};

export default function Home(props) {
  const auth = useAuth()
  const isMount = useIsMount()
  const history = useHistory()
  const [page, setPage] = useState(1)
  const [distance, setDistance] = useState('')
  const [fulfillment, setFulfillment] = useState('')
  const [fulfillmentDate, setFulfillmentDate] = useState(null)
  const [sortBy, setSortBy] = useState('popular')
  const [filterMessage, setFilterMessage] = useState('')
  const [category, setCategory] = useState(props.product.filterCategory)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    props.getProducts({
      page: 1
    })
    props.getProductsCount()
    setPage(1)
    setDistance('')
    setFulfillment('')
    setFulfillmentDate(null)
  }, [])

  useEffect(() => {
    if (!isMount || history.location.state?.from === 'drawer') {
      props.getProducts({
        page: 1,
        fulfillment: fulfillment,
        distance: distance,
        byFulfillmentDate: fulfillmentDate,
        sortBy: sortBy,
        ...category && { category: category }
      })
      props.getProductsCount({
        fulfillment: fulfillment,
        distance: distance,
        byFulfillmentDate: fulfillmentDate,
        sortBy: sortBy,
        ...category && { category: category }
      })
      window.history.replaceState({}, document.title)
    }
    setPage(1)
  }, [fulfillment, distance, fulfillmentDate, sortBy])

  useEffect(() => {
    setCategory(props.product.filterCategory)
    setDistance('')
    setFulfillment('')
    setFulfillmentDate(null)
  }, [props.product.filterCategory])

  useEffect(() => {
    if(!isMount && !auth.userData.loggedIn) {
      setFilterMessage('Login and complete profile to see accurate distances.')
    }
  }, [distance])

  const handleChangePage = function(event, value) {
    const page = value
    props.getProducts({
      page: page,
      fulfillment: fulfillment,
      distance: distance,
      byFulfillmentDate: fulfillmentDate,
      sortBy: sortBy,
      ...category && { category: category }
    })
    setPage(page)
  }

  const handleChangeDistance = (e) => {
    setDistance(e.target.value)
  }

  const handleChangeFulfillment = (e) => {
    setFulfillment(e.target.value)
  }

  const handleChangeFulfillmentDate = (value) => {
    setFulfillmentDate(value)
  }

  const handleChangeSortBy = (e) => {
    setSortBy(e.target.value)
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleClearFilters = () => {
    setDistance('')
    setFulfillment('')
    setFulfillmentDate(null)
  }

  const PREFIX = 'Home';

  const classes = {
    icon: `${PREFIX}-icon`,
    heroContent: `${PREFIX}-heroContent`,
    heroButtons: `${PREFIX}-heroButtons`,
    cardGrid: `${PREFIX}-cardGrid`,
    card: `${PREFIX}-card`,
    cardMedia: `${PREFIX}-cardMedia`,
    cardContent: `${PREFIX}-cardContent`,
    footer: `${PREFIX}-footer`,
    routerLinkButton: `${PREFIX}-routerLinkButton`,
    routerLink: `${PREFIX}-routerLink`
  };

  // TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
  const Root = styled('div')((
    {
      theme,
    }
  ) => ({
    padding: theme.spacing(2),
    [`& .${classes.icon}`]: {
      marginRight: theme.spacing(2),
    },

    [`& .${classes.heroContent}`]: {
      backgroundColor: theme.palette.background.paper,
    },

    [`& .${classes.heroButtons}`]: {
      marginBottom: theme.spacing(4),
    },

    [`& .${classes.card}`]: {
      height: '300px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },

    [`& .${classes.cardMedia}`]: {
      height: '75%',
      objectFit: 'cover'
    },

    [`& .${classes.cardContent}`]: {
      height: '25%',
      maxWidth: '300px',
      padding: theme.spacing(1),
    },

    [`& .${classes.footer}`]: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(6),
    },

    [`& .${classes.routerLinkButton}`]: {
      textDecoration: 'none',
    },

    [`& .${classes.routerLink}`]: {
      textDecoration: 'none',
    }
  }));

  return ( 
    <Root>
      <CssBaseline />
      <main>
        <Grid container spacing={2}>
          <Grid item spacing={1} container alignItems={'center'} justifyContent={'flex-start'} direction={'row'} xs={12}>
            <Grid item>
              <Button
                sx={{ py: '6.5px' }}
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={handleOpen}
              >
                Filter
              </Button>
            </Grid>
            <Grid item>
              <FormControl sx={{ minWidth: 100 } } size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  label="Sort By"
                  value={sortBy}
                  onChange={handleChangeSortBy}
                >
                  <MenuItem value={'popular'}>Popular</MenuItem>
                  <MenuItem value={'new'}>New</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {!props.userData.loggedIn &&
              <Grid item>
                <RouterLink style={{ textDecoration: 'none' }} to="/signup">
                  <Button
                    variant='contained'
                    color='primary'
                    sx={{ py: '8px' }}
                  >
                    Sign up
                  </Button>
                </RouterLink>
              </Grid>
            }
          </Grid>
          <Modal
            disableAutoFocus
            disableEnforceFocus
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={{ ...style, minWidth: 290, maxWidth: 400 }}>
              <Grid spacing={1} container flexDirection={'column'} alignItems={'flex-start'}>
                <Grid item>
                  <Typography variant='h5' component={'h5'}>
                    Filters
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography style={{color: 'red'}}>
                    {filterMessage}
                  </Typography>
                </Grid>
                <Grid item>
                  <FormControl size="small">
                    <InputLabel>Fulfillment</InputLabel>
                    <Select
                      value={fulfillment}
                      label="Fulfillment"
                      onChange={handleChangeFulfillment}
                    >
                      <MenuItem value={''}>Any</MenuItem>
                      <MenuItem value={'pickup'}>Pickup</MenuItem>
                      <MenuItem value={'delivery'}>Delivery</MenuItem>
                      <MenuItem value={'shipping'}>Shipping</MenuItem>
                    </Select>
                    <FormHelperText>Filter by fulfillment type</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl size="small">
                    <InputLabel>Miles</InputLabel>
                    <Select
                      value={distance}
                      label="Miles"
                      onChange={handleChangeDistance}
                    >
                      <MenuItem value={''}>Any</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={15}>15</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </Select>
                    <FormHelperText>Filter by distance</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl size="small">
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DatePicker
                        label='Fulfillment By'
                        format="MM/dd/yyyy"
                        value={fulfillmentDate}
                        onChange={(value) => handleChangeFulfillmentDate(value)}
                        renderInput={(params) => <TextField {...params} />}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </LocalizationProvider>
                    <FormHelperText>Filter by date</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item sx={{ width: '100%' }}>
                  <Button
                    onClick={handleClearFilters}
                    sx={{ width: '100%' }}
                    variant='contained'
                    color='primary'
                  >
                    Clear Filters
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>
          <Grid item xs={12} spacing={1} container justifyContent={'flex-start'}>
            {props.product.products ? props.product.products.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <RouterLink className={classes.routerLink} to={`/products/${card.id}`}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={`/api${card.ProductImages[0]?.path}`}
                      component="img"
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography noWrap variant="h5" component="h5">
                        {card.name}
                      </Typography>
                      <Typography noWrap variant="p" component="p">
                        {card.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </RouterLink>
              </Grid>
            )) : ''}
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <Pagination count={Math.ceil(props.product.count / 6)} page={page} color="primary" onChange={handleChangePage} />
          </Grid>
        </Grid>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Copyright />
      </footer>
      {/* End footer */}
    </Root>
  );
}
