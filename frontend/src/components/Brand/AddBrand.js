import React, {useState} from 'react'
import useForm from "../../hooks/useForm";
import {gql} from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

const ADD_BRAND = gql`
    mutation (
        $name: String!
    ){
        newBrand(data: {
            name: $name
        })
            {
            id name
        }
    }
`;

export default function AddBrand() {
    const [{ values, formLoading }, handleChange, handleSubmit] = useForm();
    const [addBrand, {loading, error, data}] = useMutation(ADD_BRAND,
        {
            variables: {
                name: values.name, 
            },
            fetchPolicy: "no-cache"
        });

    const [validationMessage, setValidationMessage] = useState();

    const addBrandHandler = (event) => {
        if(values.name.trim() === '') {
            setValidationMessage('Please inform the brand name');
            return;
        }
        addBrand();
    }
    
    return (
        <div>
            <h1>Add Brand</h1>
            {validationMessage}
            <form onSubmit={handleSubmit(addBrandHandler)}>
                <input
                    onChange={handleChange}
                    value={values.name}
                    type="text"
                    name="name"
                    placeholder="Brand"
                    required
                />
                <button type="submit">{formLoading ? "Please wait..." : "ADD"}</button>
            </form>
        </div>
    )
}
