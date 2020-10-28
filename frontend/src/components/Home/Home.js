import React from 'react'
import {Link} from 'react-router-dom';

export default function Home() {
    return (
        <div>
            <h1>Welcome home!</h1>
            <p><Link to='/protected'>See the protected area</Link> (only logged users)</p>
            <p><Link to='/login'>LOGIN</Link></p>
            <div>
                Return data using RESTful API.
                <p><Link to='/restful'>RESTful</Link></p>
            </div>
            <div>
                Return data using GraphQL (useQuery). Only admin users.
                <p><Link to='/usequery'>useQuery</Link></p>
            </div>
            <div>
                Return data using GraphQL (useLazyQuery).
                <p><Link to='/uselazyquery'>useLazyQuery</Link></p>
            </div>
            <div>
                Add brand
                <p><Link to='/addbrand'>Add Brand</Link></p>
            </div>
            <div>
                List brands
                <p><Link to='/listbrands'>List Brands</Link></p>
            </div>
            <div>
                Add category
                <p><Link to='/addcategory'>Add category</Link></p>
            </div>
            <div>
                List categories
                <p><Link to='/listcategories'>List categories</Link></p>
            </div>
        </div>
    )
}
