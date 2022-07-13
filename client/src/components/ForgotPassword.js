import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Redirect } from "react-router-dom";
import axios from 'axios'
import isEmail from 'validator/lib/isEmail';

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
    marginTop: theme.spacing(8),
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

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  let formData = {
    email: email
  }

  const validate = () => {
    console.log(email)
    for (const field of [
      { name: 'Email', value: email }
    ]) {
      if (!field.value) {
        setMessage(`${field.name} is required.`)
        return false
      }
    }
    if (!isEmail(email)) {
      setMessage('Invalid Email Address.')
      return false
    }
    
    return true
  }

  const handleSubmit = async e => {
    try {
      e.preventDefault()
      setMessage()
      const valid = validate()
      if (valid) {
        const res = await axios.post('/api/forgotpassword', formData)
        if (!res || res.data.error) {
          setMessage(res.data.error)
        } else {
          setMessage(
            "If an associated account exists, you will receive a link to reset \
            your password at the email provided."
          )
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <StyledContainer component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="email"
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
              />
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
            Submit
          </Button>
          <Typography style={{color: 'red'}}>
            {message}
          </Typography>
        </form>
      </div>
    </StyledContainer>
  );
}
