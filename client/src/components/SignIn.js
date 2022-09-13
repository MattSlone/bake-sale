import React, { useEffect, useState } from 'react'
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
import {Redirect,  Link as RouterLink, useHistory } from "react-router-dom";
import isEmail from 'validator/lib/isEmail';
import isByteLength from 'validator/lib/isByteLength';
import { useAuth } from '../hooks/use-auth';

const PREFIX = 'SignIn';

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
    marginTop: theme.spacing(1),
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

export default function SignIn() {
  const auth = useAuth()
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [attemptedRoute, setAttemptedRoute] = useState(auth.userData.attemptedRoute)

  let formData = {
    username: username,
    password: password
  }

  useEffect(() => {
    if (!auth.userData.loggedIn) {
      auth.resetUser()
    }
  }, [])

  useEffect(() => {
    if (auth.userData.error) {
      setMessage(auth.userData.error)
    }
  }, [auth.userData.error])

  const handleSubmit = e => {
    e.preventDefault()
    for (const field of [
      { name: 'Email', value: username },
      { name: 'Password', value: password }
    ]) {
      if (!field.value) {
        setMessage(`${field.name} is required.`)
        return
      }
    }
    if (!isEmail(username.replace(/\s/g, ""))) {
      setMessage("Invalid email address.")
      return
    }
    if (!isByteLength(password, { min: 5, max: 15 })) {
      setMessage("Password should be between 5 and 15 characters.")
      return
    }
    setMessage('')
    auth.userSignIn(formData)
  }

  useEffect(() => {
    if(auth.userData.loggedIn == true) {
      if (attemptedRoute) {
        auth.setAttemptedRoute('')
        history.push(attemptedRoute)
      } else {
        history.push('/')
      }
    }
  }, [auth.userData.loading])

  return (
    <StyledContainer component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={username}
            type="email"
            autoComplete="email"
            autoFocus
            onChange={e => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            autoComplete="current-password"
            onChange={e => setPassword(e.target.value)}
          />
          <Typography style={{color: 'red'}}>
            {message}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={e => handleSubmit(e)}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
            <Link component={RouterLink} variant="body2" href="#" to="/forgotpassword">
                {"Forgot Password?"}
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} variant="body2" href="#" to="/signup">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </StyledContainer>
  );
}
