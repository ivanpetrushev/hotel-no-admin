import React, {Component} from 'react';
import Listing from './listing';
import Viewer from './viewer';
import Cities from './cities';
import {Router, Link, Route} from "react-router-dom";
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
import { setContext } from 'apollo-link-context';
import Login from './Login';
import Logout from './Logout';
import Auth from './Auth';
import AuthCallback from './AuthCallback';
import history from './history';

const httpUri = 'https://api.graph.cool/simple/v1/cjo9qjp1p32hh01281qa1kwea';
const wsUri = 'wss://subscriptions.graph.cool/v1/cjo9qjp1p32hh01281qa1kwea';

const wsLink = new WebSocketLink({
  uri: wsUri,
  options: {
    reconnect: true
  }
});

const httpLink = new HttpLink({
  uri: httpUri
});

const authHttpLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('auth0IdToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  // httpLink,
  authHttpLink.concat(httpLink)
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

  constructor() {
    super();
    this.auth = new Auth();
  }

  setPageTitle = (title, slug) => {
    this.setState({
      currentPageTitle: title,
      currentPageSlug: slug
    });
  }

  render() {
    let buttons = [];
    if (this.auth.isAuthenticated()) {
      buttons.push(<Button key="1" color="primary" variant={this.state.currentPageSlug === 'hotel_listing' ? 'outlined' : 'text'} component={Link} to="/">Hotels</Button>)
      buttons.push(<Button key="2" color="primary" variant={this.state.currentPageSlug === 'city_listing' ? 'outlined' : 'text'} component={Link} to="/cities">Cities</Button>)
      buttons.push(<Button key="3" color="secondary" variant='contained' component={Link} to="/logout">Logout</Button>)
    } else {
      buttons.push(<Button key="1" color="secondary" variant='contained' component={Link} to="/login">Login</Button>)
    }

    console.log('App render(), authenticated?', this.auth.isAuthenticated(), 'href', window.location.href)

    return (
      <ApolloProvider client={client}>
        <Router history={history}>
          <div>
            <div>
              <AppBar position="static" color="default">
                <Toolbar>
                  <Typography variant="h6" color="inherit">
                    <span style={{width: 300, display: 'inline-block'}}>{this.state.currentPageTitle}</span>
                  </Typography>
                  {buttons}
                </Toolbar>
              </AppBar>

              <Route exact path="/" render={(props) => <Listing {...props} setTitle={this.setPageTitle}/>}/>
              <Route path="/listing" render={(props) => <Listing {...props} setTitle={this.setPageTitle}/>}/>
              <Route path="/listing/:cityId/:cityName" render={(props) => <Listing {...props} setTitle={this.setPageTitle}/>}/>
              <Route path="/view/:id" render={(props) => <Viewer {...props} setTitle={this.setPageTitle}/>}/>
              <Route path="/cities" render={(props) => <Cities {...props} setTitle={this.setPageTitle}/>}/>
            </div>
            <Route path="/callback" component={AuthCallback} />
            <Route path="/logout" component={Logout} />
            <Route path="/login" component={Login} />

          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
