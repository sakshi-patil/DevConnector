import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import jwtDecode from 'jwt-decode'

import { GET_ERRORS, SET_CURRENT_USER } from './types'

// register user
export const registerUser = (userData, history) => dispatch => {
  axios.post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

// Login - Get user JWT
export const loginUser = (userData) => dispatch => {
  axios.post('/api/users/login', userData).then(res => {
    // save to local storage
    const { token } = res.data

    // set token to local storage
    window.localStorage.setItem('jwtToken', token)

    // set token to auth header
    setAuthToken(token)

    // decode token to get user data
    const decoded = jwtDecode(token)

    // set current user
    dispatch(setCurrentUser(decoded))
  }).catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

// set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded

  }
}

// logout user
export const logoutUser = () => dispatch => {
  // remove token from local localStorage
  window.localStorage.removeItem('jwtToken')

  // remove auth header for future requests
  setAuthToken(false)

  // set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}))
}