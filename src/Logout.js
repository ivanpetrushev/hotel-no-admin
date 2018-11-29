import React from 'react';
import Auth from './SimpleAuth';

class Logout extends React.Component {

  constructor() {
    super();
    let auth = new Auth();
    auth.logout();
  }

  render () {
    // formal return as auth.logout() should redirect to '/'
    return (
      <div></div>
    );

  }
}

export default Logout;