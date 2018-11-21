import React, {Component} from 'react';
import Listing from './listing';
import Viewer from './viewer';
import Cities from './cities';
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  uri: 'https://api-euwest.graphcms.com/v1/cjo8axbur5jsp01gl5slsksbm/master',
  request: operation => {
    operation.setContext({
      headers: {
        // authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoxLCJ0b2tlbklkIjoiZGJkZGU5ODUtNjNhNi00NzA0LWI4ZDUtNmUyNGVmMmRiYTc2In0.zGQRTQhkH8QOeEyZJGqrLWBtpMlZg3UYr_XG_xRyhJM`,
        // authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoxLCJ0b2tlbklkIjoiZGUwZjQ5NzktMGVkYS00ZDkyLWE0NmMtMmI4YWYyNDkzYWJjIn0.cWtmPXVNwgy5mLadJD-R6_8rw7OIOwrK46NKLxoEZEw`,
        authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoxLCJ0b2tlbklkIjoiMGRlYzY5ZGEtODIyZi00ZjA0LTgyNzQtNWVmZGNkZTkzMGFkIn0.tnoZCetJKVesMvvBO_wDQ1w1aYNRC-xwaCVv0LIdw1o`,
      },
    });
  },
});

class App extends Component {
  state = {
    currentPageTitle: 'Home',
    currentPageSlug: 'home'
  }

  setPageTitle = (title, slug) => {
    this.setState({
      currentPageTitle: title,
      currentPageSlug: slug
    });
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div>
            <AppBar position="static" color="default">
              <Toolbar>
                <Typography variant="h6" color="inherit">
                  <span style={{width: 300, display: 'inline-block'}}>{this.state.currentPageTitle}</span>
                </Typography>
                <Button color="primary" variant={this.state.currentPageSlug === 'hotel_listing' ? 'outlined' : 'text'} component={Link} to="/">Hotels</Button>
                <Button color="primary" variant={this.state.currentPageSlug === 'city_listing' ? 'outlined' : 'text'} component={Link} to="/cities">Cities</Button>
              </Toolbar>
            </AppBar>

            <Route exact path="/" render={(props) => <Listing {...props} setTitle={this.setPageTitle}/>}/>
            <Route path="/listing/:cityId/:cityName" render={(props) => <Listing {...props} setTitle={this.setPageTitle}/>}/>
            <Route path="/view/:id" render={(props) => <Viewer {...props} setTitle={this.setPageTitle}/>}/>
            <Route path="/cities" render={(props) => <Cities {...props} setTitle={this.setPageTitle}/>}/>
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
