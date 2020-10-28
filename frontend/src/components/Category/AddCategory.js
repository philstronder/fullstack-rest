import React, {useState} from 'react'
import useForm from "../../hooks/useForm";
import {gql} from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

const ADD_CATEGORY = gql`
    mutation (
        $name: String!
    ){
        newCategory(data: {
            name: $name
        })
            {
            id name
        }
    }
`;

export default function AddBrand() {
    const [{ values, formLoading }, handleChange, handleSubmit] = useForm();
    const [addBrand, {loading, error, data}] = useMutation(ADD_CATEGORY,
        {
            variables: {
                name: values.name, 
            },
            fetchPolicy: "no-cache"
        });

    const [validationMessage, setValidationMessage] = useState();

    const addBrandHandler = (event) => {
        if(values.name.trim() === '') {
            setValidationMessage('Please inform the category');
            return;
        }
        addBrand();
    }
    
    return (
        <div>
            <h1>Add Category</h1>
            {validationMessage}
            <form onSubmit={handleSubmit(addBrandHandler)}>
                <input
                    onChange={handleChange}
                    value={values.name}
                    type="text"
                    name="name"
                    placeholder="Category"
                    required
                />
                <button type="submit">{formLoading ? "Please wait..." : "ADD"}</button>
            </form>
        </div>
    )
}
