import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import Auth from './Auth';

class Login extends React.Component {

  render () {
    let auth = new Auth();
    auth.login();

    return (
      <Redirect component={Link} to="/"/>
    );
  }
}

export default Login;