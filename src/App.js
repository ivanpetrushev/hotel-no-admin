import React, {Component} from 'react';
import Listing from './listing';
import Viewer from './viewer';
import Cities from './cities';
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class App extends Component {
  state = {
    currentPage: 'Home'
  }

  setPageTitle = (title) => {
    this.setState({currentPage: title});
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <AppBar position="static" color="default">
              <Toolbar>
                <Typography variant="h6" color="inherit">
                  Page Title: {this.state.currentPage}
                </Typography>
                <Button color="primary" component={Link} to="/">Hotels</Button>
                <Button color="primary" component={Link} to="/cities">Cities</Button>
              </Toolbar>
            </AppBar>

            <Route exact path="/" render={(props) => <Listing {...props} setTitle={this.setPageTitle}/>}/>
            <Route path="/view/:id" render={(props) => <Viewer {...props} setTitle={this.setPageTitle}/>}/>
            <Route path="/cities" render={(props) => <Cities {...props} setTitle={this.setPageTitle}/>}/>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
