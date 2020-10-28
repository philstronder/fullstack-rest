import React, {useEffect} from 'react'
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks'


const GET_USER = gql`
    query{
        profiles{
            id name 
        }
    }
    `;

export default function GraphQL() {

    const {loading, error, data}= useQuery(GET_USER);

    if(loading) return <p>Loading...</p>
    if(error) return <p>Error :( {error}</p>
    

    return data.profiles.map(({id, name}) => (
        <div key={id}>
            <p>
                {id}: {name}
            </p>
        </div>
    ));
}
