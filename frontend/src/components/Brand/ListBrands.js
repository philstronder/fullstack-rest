import React, {useEffect, useState} from 'react'
import {gql} from 'apollo-boost';
import {useQuery} from '@apollo/react-hooks'

const GET_BRANDS  = gql `
    query{
        brands{
            id name
        }
    }
`;

export default function ListBrands() {

    const {loading, error, data} = useQuery(GET_BRANDS);
    const [brandsList, setBrandsList] = useState();
    let brands;

    useEffect(() => {
        if(data && data.brands) {
            brands = data.brands.map(x => 
                <li key={x.id}>{x.name}</li>
            )
            setBrandsList(brands)
        } else {
            brands = <li>Loading</li>
        }
    }, [data])

    return (
        <div>
            <h1>Brands</h1>
            <ul>
                {brandsList}
            </ul>
        </div>
    )
}
