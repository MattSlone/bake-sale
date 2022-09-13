import React, { useEffect, useState, useRef } from 'react';
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
      <Link color="inherit" href="https://bake.sale/">
        Bake.Sale
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignUp(props) {
  const auth = useAuth()
  let recaptcha
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')

  let formData = {
    username: username,
    password: password,
    token: token
  }

  function onChange(value) {
    setToken(value);
  }

  useEffect(() => {
    if (!auth.userData.loggedIn) {
      auth.resetUser()
    }
  }, [])

  useEffect(() => {
    if (auth.userData.loading) {
      setMessage('loading...')
    } else {
      if (auth.userData.error) {
        setMessage(auth.userData.error)
      } else {
        setUsername('')
        setPassword('')
        if (auth.userData.message) {
          setMessage(auth.userData.message)
        } else {
          setMessage('')
        }
      }
    }
  }, [auth.userData.loading])

  const handleSubmit = e => {
    const valid = validate()
    if (valid.success) {
      setMessage('')
      recaptcha.reset()
      auth.userSignUp(formData)
    } else {
      setMessage(valid.error)
    }
  }

  const validate = () => {
    let rtn = { error: '', success: false }
    for (const field of [
      { name: 'Email', value: username },
      { name: 'Password', value: password },
      { name: 'ReCaptcha', value: token }
    ]) {
      if (!field.value) {
        rtn.error = `${field.name} is required.`
        return rtn
      }
    }
    if (!isEmail(username.replace(/\s/g, ""))) {
      rtn.error = 'Invalid email address'
      return rtn
    }
    if (!isByteLength(password, { min: 5, max: 15 })) {
      rtn.error = "Password should be between 5 and 15 characters."
      return rtn
    }
    rtn.success = true
    return rtn
  }

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
            <Grid item xs={12}>
              <ReCAPTCHA
                ref={el => { recaptcha = el }}
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
