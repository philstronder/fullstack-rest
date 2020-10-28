import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom';

import {ApolloProvider} from '@apollo/react-hooks';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import {setContext} from 'apollo-link-context'
import {getToken} from './services/auth'

// const httpLink = createHttpLink({
//   uri: 'http://localhost:4000/',
// });

// const authLink = setContext((_, { headers }) => {
//   //const token = localStorage.getItem('token')
//   const token = getToken();
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//     }
//   }
// });

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  request: (operation) => {
    const token = getToken()
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    })
  }
})

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
          <App />
      </ApolloProvider>    
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
