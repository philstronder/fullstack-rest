import React from 'react';
import './App.css';
import Login from './components/Login/Login';
import {Switch, Route} from 'react-router-dom'
import Home from './components/Home/Home';
import Protected from './components/Protected/Protected';
import AuthenticatedRoute from './components/Security/AuthenticatedRoute'
import {isAuthenticated} from './services/auth';
import UseQuery from './components/GraphQL/Query'; 
import UseLazyQuery from './components/GraphQL/LazyQuery'; 
import RESTful from './components/RESTful/RESTful';
import Signup from './components/Signup/Signup';
import Signup2 from './components/Signup2/Signup2';
import AddBrand from './components/Brand/AddBrand';
import ListBrands from './components/Brand/ListBrands'
import AddCategory from './components/Category/AddCategory'
import ListCategories from './components/Category/ListCategories'


function App() {
    return(
      <Switch>
        <AuthenticatedRoute path="/protected" component={Protected} appProps={{ isAuthenticated }} />
        <Route path='/login' component={Login}></Route>
        <Route path='/restful' component={RESTful}/>
        <Route path='/usequery' component={UseQuery}/>
        <Route path='/uselazyquery' component={UseLazyQuery}/>
        <Route path='/signup' component={Signup}/>
        <Route path='/signup2' component={Signup2}/>
        <Route path='/addbrand' component={AddBrand}/>
        <Route path='/listbrands' component={ListBrands}/>
        <Route path='/addcategory' component={AddCategory}/>
        <Route path='/listcategories' component={ListCategories}/>
        <Route path='/' exact component={Home} />
        <Route path="*" component={() => <h1>Page not found</h1>} />
      </Switch>
    );
}


export default App;
