import React, {Component} from 'react';
import Listing from './listing';
import Viewer from './viewer';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";


class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Listing}/>
          <Route path="/view/:id" component={Viewer}/>
        </div>
      </Router>


    );
  }
}

export default App;
