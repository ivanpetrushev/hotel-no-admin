import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import Auth from './Auth';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import {gql} from 'apollo-boost';
import {Query, Mutation, Subscription} from "react-apollo";

class Login extends React.Component {
  SIGNIN_USER = gql`
      mutation {
          signinUser(email:{
              email: $email,
              password: $password
          }){
              user {
                  id
              }
              token
          }
      }
  `;

  render () {
    // let auth = new Auth();
    // auth.login();

    return (
      <Mutation mutation={this.SIGNIN_USER}>
      <form id="form-login" onSubmit={(e) => {
        e.preventDefault();
        this.handleSubmit()
      }}>
        <Input placeholder="Email" name="email" style={{marginRight: 10}} required/>
        <Input placeholder="Password" name="password" style={{marginRight: 10}} type="password"
               required/>
        <Button color="primary" variant="contained" type="submit">Login</Button>
      </form>
      </Mutation>
    );
  }
}

export default Login;