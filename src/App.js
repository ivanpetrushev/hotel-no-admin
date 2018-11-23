import React, {Component} from 'react';
import Listing from './listing';
import Viewer from './viewer';
import Cities from './cities';
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from "react-apollo";
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from "apollo-cache-inmemory";



const wsLink = new WebSocketLink({
  uri: `wss://subscriptions.graph.cool/v1/cjo9qjp1p32hh01281qa1kwea`,
  options: {
    reconnect: true
  }
});
const httpLink = new HttpLink({
  uri: 'https://api.graph.cool/simple/v1/cjo9qjp1p32hh01281qa1kwea'
});
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);



const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
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
