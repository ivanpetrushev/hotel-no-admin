import React from 'react';
import {withRouter, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
import {gql} from 'apollo-boost';
import Auth from './Auth';

class AuthCallback extends React.Component {

  constructor() {
    super();
    this.auth = new Auth();
  }

  CREATE_USER = gql`
    mutation($idToken: String!, $username: String!) {
        createUser(
            authProvider: { auth0: { idToken: $idToken } }
            username: $username
        ) {
            id
        }
    }
`;

  GET_USER = gql`
    query {
        user {
            id
        }
    }
`;

  // state = {
  //   username: ''
  // };
  //
  // createUser = () => {
  //   const variables = {
  //     idToken: window.localStorage.getItem('auth0IdToken'),
  //     username: this.state.username
  //   };
  //
  //   this.props
  //     .createUser({variables})
  //     .then(res => {
  //       this.props.history.replace('/');
  //     })
  //     .catch(error => {
  //       console.error(error);
  //       this.props.history.replace('/');
  //     });
  // };

  render() {
    console.log('in callback this', this)
    console.log('in callback this props', this.props)
    this.auth.handleAuthentication();
    return "hop inside CreateUser!";


    if (this.props.data.loading) {
      return <div>Loading</div>;
    }

    if (
      this.props.data.user ||
      window.localStorage.getItem('auth0IdToken') === null
    ) {
      return (
        <Redirect to={{pathname: '/'}}/>
      );
    }

    return (
      <div style={this.container}>
        <input
          style={this.usernameInput}
          value={this.state.username}
          placeholder="Username"
          onChange={e => this.setState({username: e.target.value})}
        />

        {this.state.username &&
        <button style={this.createBtn} onClick={this.createUser}>
          Create
        </button>}
      </div>
    );
  }
}

export default AuthCallback;