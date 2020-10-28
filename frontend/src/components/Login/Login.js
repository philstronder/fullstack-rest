import React, {useEffect, useState, useRef} from 'react'
import useForm from "../../hooks/useForm";
import {gql} from 'apollo-boost';
import { useLazyQuery } from '@apollo/react-hooks';
import { login } from '../../services/auth';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © Equipment Manager '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const GET_LOGIN = gql`
    query(
        $email: String!
        $password: String!
    ){
        login(data: {
            email: $email
            password: $password
        }){
            id name email token profiles {id name}
        }
    } 
`;

export default function SignIn(props) {
    const [{ values, formLoading }, handleChange, handleSubmit] = useForm();
    const [validateCredentials, {loading, error, data}] = useLazyQuery(GET_LOGIN,
        {
            variables: {
                email: values.email, 
                password: values.password
            },
            fetchPolicy: "network-only"
        });
    
    const [errorEmail, setErrorEmail] = useState();
    const [errorPassword, setErrorPassword] = useState();

    const validateForm = () => {
        if(!values.email) {
            setErrorEmail({
                error: true,
                helperText: 'Please inform your email address'
            })
            return;
        } else {
            setErrorEmail({
                error: false,
                helperText: false
            })
        }
        
        if(!values.password) {
            setErrorPassword({
                error: true,
                helperText: 'Please inform your password'
            });
            return; 
        } else {
            setErrorPassword({
                error: false,
                helperText: false
            });
        }
    } 

    const loginHandler = (event) => {
        validateForm();

        if(values.email && values.password)    
            validateCredentials();
    }

    useEffect(() => {
        if(error) {
            setErrorPassword({
                error: true,
                helperText: 'Invalid username or password'
            });
        }
    }, [error]);

    useEffect(() => {
        if(data && data.login) {
            //stores the token on localStorage
            login(data.login.token);
            props.history.push('/')
        } 
    }, [data])    

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(loginHandler)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            {...errorEmail}
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange}
            value={values.email || ''}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            {...errorPassword}
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
            value={values.password || ''}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup2" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );

}