import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';

import { setCurrentUser, logoutUser } from './actions/authActions'
import { ClearCurrentProfile } from './actions/profileActions'

import { Provider } from 'react-redux';
import store from './store';

import PrivateRoute from './components/common/PrivateRoute'


import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';


import './App.css';
import { clearCurrentProfile } from './actions/profileActions'


//Check For token
if(localStorage.jwtToken) {
  // Set Auth token header auth
  setAuthToken(localStorage.jwtToken);
  //Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  //Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // check for expired token
  const currentTime = Date.now() / 1000
  if (decoded.exp < currentTime) {
    // logout user
    store.dispatch(logoutUser())
    //Clear Current Profile
    store.dispatch(clearCurrentProfile())
    //Redirect to login
    window.location.href = '/login';
  }
}



class App extends Component {
  render() {
    return (
      <Provider store={ store } >
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path = "/" component = {Landing} />
            <div className="container">
              <Route exact path = "/register" component={Register} />
              <Route exact path = "/login" component={Login} />
              <switch>
                <PrivateRoute exact path = "/dashboard" component={Dashboard} />
              </switch>
              <switch>
                <PrivateRoute exact path = "/create-profile" component={CreateProfile} />
              </switch>
            </div>

            <Footer />
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App;