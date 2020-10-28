import React, {useEffect} from 'react'
import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks'


const GET_USER = gql`
    query(
        $id: Int
        $email: String
    ){
        user(filter: {
            id: $id
            email: $email
        }) {
            id name email profiles {description}
        }
    }
    `;

export default function GraphQL() {

    const [getUser, {loading, error, data}] = useLazyQuery(GET_USER, 
    {
        variables: {id: 9},
    });

    useEffect(() => {
        getUser();
    },[])
    

    if(loading) return <p>Loading...</p>
    if(error) return <p>Error :( {error}</p>

    
    if(data) return (
        <div>
            <p>Id: {data.user.id}</p>
            <p>User: {data.user.name}</p>
            <p>E-mail: {data.user.email}</p>
        </div>
    );

    return <p>GraphQL</p>
}
