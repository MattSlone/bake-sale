import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Redirect } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from '../hooks/use-auth';
import isAlpha from 'validator/lib/isAlpha';

const PREFIX = 'Profile';

const classes = {
  paper: `${PREFIX}-paper`,
  avatar: `${PREFIX}-avatar`,
  form: `${PREFIX}-form`,
  submit: `${PREFIX}-submit`,
  routerLinkButton: `${PREFIX}-routerLinkButton`
};

const StyledContainer = styled(Container)((
  {
    theme
  }
) => ({
  [`& .${classes.paper}`]: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  [`& .${classes.avatar}`]: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },

  [`& .${classes.form}`]: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },

  [`& .${classes.submit}`]: {
    margin: theme.spacing(3, 0, 2),
  },

  [`& .${classes.routerLinkButton}`]: {
    textDecoration: 'none',
  }
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Profile(props) {
  const auth = useAuth()
  const [firstName, setFirstName] = useState(props.user.firstName)
  const [lastName, setLastName] = useState(props.user.lastName)
  const [street, setStreet] = useState(props.user.street)
  const [city, setCity] = useState(props.user.city)
  const [state, setState] = useState(props.user.state)
  const [zipcode, setZipcode] = useState(props.user.zipcode)
  const [seller, setSeller] = useState(props.user.seller)
  const [validAddress, setValidAddress] = useState(false)
  const [message, setMessage] = useState('')
  let formData = {
    firstName: firstName,
    lastName: lastName,
    street: street,
    city: city,
    state: state,
    zipcode: zipcode,
    seller: seller
  }

  const getFormattedAddress = () => {
    props.getFormattedAddress(formData)
  }

  useEffect(() => {
    auth.resetUserError()
  }, [])

  useEffect(() => {
    if (auth.userData.loading === false && auth.userData.validAddress === true) {
      setStreet(auth.userData.street)
      setCity(auth.userData.city)
      setState(auth.userData.state)
      setZipcode(auth.userData.zipcode)
      setValidAddress(true)
    } else {
      setValidAddress(false)
      if (auth.userData.error) {
        setMessage(auth.userData.error)
      }
    }
  }, [auth.userData.loading])

  const handleSubmit = e => {
    e.preventDefault()
    setMessage('')
    getFormattedAddress()
  }

  useEffect(() => {
    if (validAddress) {
      for (const field of [
        { name: 'First name', value: firstName },
        { name: 'Last name', value: lastName },
        { name: 'Street', value: street },
        { name: 'City', value: city },
        { name: 'State', value: state },
        { name: 'Zipcode', value: zipcode },
      ]) {
        if (!field.value) {
          setMessage(`${field.name} is required.`)
          return
        }
      }
      if (!(firstName && isAlpha(firstName)) || !(lastName && isAlpha(lastName))) {
        setMessage('Name may only contain letters.')
        return
      }
      props.editUser(formData)
      setMessage('Your changes have been saved')
    }
  }, [validAddress])

  return (
    <StyledContainer component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Edit Profile
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="street"
                label="Street"
                name="street"
                autoComplete="street"
                value={street}
                onChange={e => setStreet(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="city"
                label="City"
                name="city"
                autoComplete="city"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="state"
                label="State"
                name="state"
                autoComplete="state"
                value={state}
                onChange={e => setState(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="zipcode"
                label="Zipcode"
                name="zipcode"
                autoComplete="zipcode"
                value={zipcode}
                onChange={e => setZipcode(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={seller} onChange={e => setSeller(e.target.checked)} color="primary" />}
                label="Seller account"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography style={{color: 'red'}}>
                {message}
              </Typography>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={e => handleSubmit(e)}
          >
            Save
          </Button>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </StyledContainer>
  );
}
