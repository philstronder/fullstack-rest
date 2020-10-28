import React, {useEffect, useState, useRef} from 'react'
import useForm from "../../hooks/useForm";
import {gql} from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { login } from '../../services/auth';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
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

const REGISTER_USER = gql`
    mutation(
        $name: String!
        $email: String!
        $password: String!
    ){
        registerUser(data: {
            name: $name
            email: $email
            password: $password
        }){
            id name email token profiles {id name}
        }
    } 
`;

export default function SignIn(props) {
  const [{ values, formLoading }, handleChange, handleSubmit] = useForm();
  const [registerUser, {data, error}] = useMutation(REGISTER_USER,
      {
          variables: {
              name: values.name,
              email: values.email, 
              password: values.password
          },
          fetchPolicy: "no-cache"
      });
    
    const [errorEmail, setErrorEmail] = useState();
    const [errorPassword, setErrorPassword] = useState();
    const [errorName, setErrorName] = useState();

    const validateForm = () => {
        if(!values.name) {
            setErrorName({
                error: true,
                helperText: 'Please inform your name'
            });
            return; 
        } else {
            setErrorName({
                error: false,
                helperText: false
            });
        }
      
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

    const signupHandler = (event) => {
        validateForm();

        if(values.name && values.email && values.password)    
            registerUser();
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
      
        if(data && data.registerUser) {
            props.history.push('/login')
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
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(signupHandler)}>
        <TextField
            variant="outlined"
            margin="normal"
            required
            {...errorName}
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            onChange={handleChange}
            value={values.name || ''}
          />
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );

}