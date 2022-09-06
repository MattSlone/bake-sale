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
import Link from '@mui/material/Link'
import { Redirect, useLocation, Link as RouterLink } from "react-router-dom";
import axios from 'axios'
import isByteLength from 'validator/lib/isByteLength';

const PREFIX = 'ResetPassword';

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

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const query = useQuery()
  const token = query.get('token')
  const [showSignIn, setShowSignIn] = useState(false)

  let formData = {
    password: password,
    token: token
  }

  const validate = () => {
    for (const field of [
      { name: 'Password', value: password },
      { name: 'Token', value: token }
    ]) {
      if (!field.value) {
        setMessage(`${field.name} is required.`)
        return false
      }
    }
    if (!isByteLength(password, { min: 5, max: 15 })) {
      setMessage("Password should be between 5 and 15 characters.")
      return
    }
    return true
  }

  const handleSubmit = async e => {
    try {
      e.preventDefault()
      const validated = validate()
      if (validated) {
        setMessage("Loading...")
        const res = await axios.post('/api/resetpassword', formData)
        if (!res || res.data.error) {
          setMessage(res.data.error)
        } else {
          setPassword("")
          setMessage("Your password has been reset.")
          setShowSignIn(true)
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
          Reset Password
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Grid>
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
          <Typography>
            <span style={{color: 'red'}}>{`${message} `}</span>
            {showSignIn ? 
            <Link component={RouterLink} href="#" to='/signin'>
              Sign in
            </Link>
            : ''}
          </Typography>
        </form>
      </div>
    </StyledContainer>
  );
}
