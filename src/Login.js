import React, {Fragment} from 'react';
import {Redirect, Link} from 'react-router-dom';
import Auth from './SimpleAuth';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import {gql} from 'apollo-boost';
import {Query, Mutation, Subscription} from "react-apollo";
import AlertDialog from './AlertDialog';
import history from './History';

class Login extends React.Component {
  state = {
    alertOpen: false,
    alertTitle: '',
    alertContent: ''
  }

  auth = new Auth();

  SIGNIN_USER = gql`
      mutation signinUser($email: String!, $password: String!) {
          signinUser(email: {email: $email, password: $password}) {
              user {
                  id, email
              }
              token
          }
      }
  `;

  handleSubmit = (event, callback) => {
    let variables = {
      email: event.target.elements.email.value,
      password: event.target.elements.password.value,
    };
    callback({
      variables: variables
    }).then(response => {
      console.log('response', response)
      // @TODO
      this.auth.setSession(response.data);
      history.replace('/');
    }).catch(e => {
      this.setState({
        alertOpen: true,
        alertTitle: 'Invalid user',
        alertContent: 'No user found with that information'
      })
    });
    // this.setState({snackbarAddedOpen: true});
    document.getElementById("form-login").reset();

  }

  render() {
    // let auth = new Auth();
    // auth.login();

    return (
      <Fragment>
        <AlertDialog open={this.state.alertOpen} title={this.state.alertTitle} content={this.state.alertContent}
                     handleClose={() => this.setState({alertOpen: false})}/>

        <Card style={{maxWidth: 400, height: 300, margin: 'auto', marginTop: 20}}>
          <CardHeader title="Login"/>
          <CardContent>
            <Mutation mutation={this.SIGNIN_USER}>
              {(callback, {data}) => (
                <form id="form-login" style={{textAlign: 'center'}} onSubmit={(e) => {
                  e.preventDefault();
                  this.handleSubmit(e, callback, data)
                }}>
                  <div><Input placeholder="Email" name="email" required/></div>
                  <div><Input placeholder="Password" name="password" type="password" required/></div>
                  <div><Button color="primary" variant="contained" type="submit">Login</Button></div>
                </form>
              )}
            </Mutation>
          </CardContent>
        </Card>
      </Fragment>
    );
  }
}

export default Login;