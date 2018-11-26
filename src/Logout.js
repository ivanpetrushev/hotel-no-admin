import React from 'react';
import Auth from './Auth';

class Logout extends React.Component {

  constructor() {
    super();
    let auth = new Auth();
    auth.logout();
  }

  render () {
    return (
      <div></div>
    );

  }
}

export default Logout;