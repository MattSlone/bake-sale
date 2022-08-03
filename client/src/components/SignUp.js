import React, { useEffect, useState } from 'react';
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
import isEmail from 'validator/lib/isEmail';
import isByteLength from 'validator/lib/isByteLength';
import isAlpha from 'validator/lib/isAlpha';
import isEmpty from 'validator/lib/isEmpty'
import { useAuth } from '../hooks/use-auth';
import ReCAPTCHA from "react-google-recaptcha";

const PREFIX = 'SignUp';

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

export default function SignUp(props) {
  const auth = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [street, setStreet] = useState('')
  const [street2, setStreet2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [lat, setLat] = useState(0)
  const [lng, setLng] = useState(0)
  const [zipcode, setZipcode] = useState('')
  const [seller, setSeller] = useState(0)
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')
  const [validAddress, setValidAddress] = useState(false)

  let formData = {
    firstName: firstName,
    lastName: lastName,
    street: street,
    street2: street2,
    city: city,
    state: state,
    lat: lat,
    lng: lng,
    zipcode: zipcode,
    username: username,
    password: password,
    seller: seller,
    token: token
  }

  const getFormattedAddress = () => {
    props.getFormattedAddress(formData)
  }

  function onChange(value) {
    setToken(value);
  }

  useEffect(() => {
    if (auth.userData.loading === false && auth.userData.validAddress === true) {
      setStreet(props.userData.street)
      setCity(props.userData.city)
      setState(props.userData.state)
      setZipcode(props.userData.zipcode)
      setLat(props.userData.lat)
      setLng(props.userData.lng)
      setValidAddress(true)
    } else {
      setValidAddress(false)
      if (auth.userData.error) {
        setMessage(auth.userData.error)
      }
    }
  }, [auth.userData.loading])

  const handleSubmit = e => {
    const valid = validate()
    if (valid.success) {
      setMessage('')
      getFormattedAddress()
    } else {
      setMessage(valid.error)
    }
  }

  const validate = () => {
    let rtn = { error: '', success: false }
    for (const field of [
      { name: 'First name', value: firstName },
      { name: 'Last name', value: lastName },
      { name: 'Street', value: street },
      { name: 'City', value: city },
      { name: 'State', value: state },
      { name: 'Zipcode', value: zipcode },
      { name: 'Email', value: username },
      { name: 'Password', value: password },
      { name: 'ReCaptcha', value: token }
    ]) {
      if (!field.value) {
        rtn.error = `${field.name} is required.`
        return rtn
      }
    }
    if (!isEmail(username)) {
      rtn.error = 'Invalid email address'
      return rtn
    }
    if (!(firstName && isAlpha(firstName)) || !(lastName && isAlpha(lastName))) {
      rtn.error = 'Name may only contain letters.'
      return rtn
    }
    if (!isByteLength(password, { min: 5, max: 15 })) {
      rtn.error = "Password should be between 5 and 15 characters."
      return rtn
    }
    rtn.success = true
    return rtn
  }

  useEffect(() => {
    if (validAddress) {
      auth.userSignUp(formData)
    }
  }, [validAddress])

  useEffect(() => {
    if (auth.userData.loading == false && !auth.userData.error) {
      <Redirect to='/signin' />
    }
  }, auth.userSignUp)

  if(auth.userData.loggedIn == true) {
    return (
      <Redirect to='/' />
    )
  }

  return (
    <StyledContainer component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
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
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
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
                fullWidth
                id="street2"
                label="Apartment, suite, etc."
                name="street2"
                autoComplete="street2"
                value={street2}
                onChange={e => setStreet2(e.target.value)}
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
                control={<Checkbox value={1} onChange={e => setSeller(e.target.value)} color="primary" />}
                label="Seller account"
              />
            </Grid>
            <Grid item xs={12}>
              <ReCAPTCHA
                isolated={1}
                sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography style={{color: 'red'}}>
                {message}
              </Typography>
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={e => handleSubmit(e)}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} href="#" variant="body2" to='/signin'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </StyledContainer>
  );
}
