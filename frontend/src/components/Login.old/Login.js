import React, {useEffect, useState, useRef} from 'react'
import useForm from "../../hooks/useForm";
import {gql} from 'apollo-boost';
import { useLazyQuery } from '@apollo/react-hooks';
import {Link} from 'react-router-dom';
import { login } from '../../services/auth';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import './Login.css'


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

export default function Login() {
    const [{ values, formLoading }, handleChange, handleSubmit] = useForm();
    const [validateCredentials, {loading, error, data}] = useLazyQuery(GET_LOGIN,
        {
            variables: {
                email: values.email, 
                password: values.password
            },
            fetchPolicy: "network-only"
        });
    
    const [validationMessage, setValidationMessage] = useState(); 

    const emailEl = useRef(null);
    const passwordEl = useRef(null);

    const loginHandler = (event) => {
        console.log(values)
        
        console.log(emailEl)
        

        if(!values.email) {
            //setValidationMessage('Please inform your e-mail');
            emailEl.current.setAttribute('error', '')
            return;
        }
        
        if(!values.password) {
            setValidationMessage('Please inform your password');
            return;
        }
            
        validateCredentials();
    }

    useEffect(() => {
        //stores the token on localStorage
        if(data && data.login) {
            login(data.login.token);
        }        
    }, [data])

    
    if(loading) return 'Loading...'

    //TODO: show error message to user
    return (
        <div>
            {/* <h1>Login</h1> */}
            
            {validationMessage}
            <form onSubmit={handleSubmit(loginHandler)}>
            <Typography variant="h4">
                Login
            </Typography>
                <TextField   
                    id="email" 
                    name="email"
                    label="Email Address"
                    required
                    // helperText="nono" 
                    ref={emailEl}
                    onChange={handleChange}
                    value={values.email}/>

                <TextField id="password"
                    name="password"
                    label="Password"
                    required
                    type="password"
                    autoComplete="current-password"
                    ref={passwordEl}
                    onChange={handleChange}
                />
                {/* <input
                    onChange={handleChange}
                    type="text"
                    name="email"
                    placeholder="E-mail"
                />
                <input
                    onChange={handleChange}
                    type="text"
                    name="password"
                    placeholder="Password"
                />   */}
                {/* <button type="submit">{formLoading ? "Please wait..." : "Login"}</button> */}
                <Button variant="contained" color="primary">
                    Login
                </Button>
            </form>
            <Link to='/signup'>Sign up here</Link>
        </div>
    )
}