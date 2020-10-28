import React, {useEffect, useState} from 'react'
import useForm from "../../hooks/useForm";
import {gql} from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

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

export default function Signup() {

    const [{ values, formLoading }, handleChange, handleSubmit] = useForm();
    const [registerUser, {data}] = useMutation(REGISTER_USER,
        {
            variables: {
                name: values.name,
                email: values.email, 
                password: values.password
            },
            fetchPolicy: "no-cache"
        });
    

    const signupHandler = (event) => {
        registerUser();
    }

    useEffect(() => {
        if(data) console.log(data)
    }, [data])
    

    return (
        <div>
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit(signupHandler)}>
                <input
                    onChange={handleChange}
                    type="text"
                    name="name"
                    placeholder="Name"
                />
                <input
                    onChange={handleChange}
                    type="text"
                    name="email"
                    placeholder="E-mail"
                />
                <input
                    onChange={handleChange}
                    type="password"
                    name="password"
                    placeholder="Password"
                />  
                <button type="submit">{formLoading ? "Loading..." : "Submit"}</button>
            </form>
        </div>
    )
}
