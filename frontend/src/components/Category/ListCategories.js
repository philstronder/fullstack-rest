import React, {useEffect, useState} from 'react'
import {gql} from 'apollo-boost';
import {useQuery} from '@apollo/react-hooks'

const GET_CATEGORIES  = gql `
    query{
        categories{
            id name
        }
    }
`;

export default function ListBrands() {

    const {loading, error, data} = useQuery(GET_CATEGORIES);
    const [categoriesList, setCategoriesList] = useState();
    let categories;

    useEffect(() => {
        if(data && data.categories) {
            categories = data.categories.map(x => 
                <li key={x.id}>{x.name}</li>
            )
            setCategoriesList(categories)
        } else {
            categories = <li>Loading</li>
        }
    }, [data])

    return (
        <div>
            <h1>Categories</h1>
            <ul>
                {categoriesList}
            </ul>
        </div>
    )
}
