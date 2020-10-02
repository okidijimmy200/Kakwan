import React, { Component } from 'react'
import {Route, Redirect } from 'react-router-dom'
import auth from './auth-helper'

//--this will load only when the user is authenticated
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
// call to the isAuthenticated method otherwise redirect to signup
      auth.isAuthenticated() ? (
        <Component {...props}/>
      ) : (
        <Redirect to={{
          pathname: '/signin',
          state: { from: props.location }
          }}/>
        )
      )}/>
    )

export default PrivateRoute

