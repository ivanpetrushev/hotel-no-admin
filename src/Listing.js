import React, {Component} from 'react';
import {gql} from 'apollo-boost';
import {Query} from "react-apollo";
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import IconStarRate from '@material-ui/icons/StarRate';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";
import Auth from './SimpleAuth';

class Listing extends Component {
  auth = new Auth;

  state = {
    result: null,
    hotels: []
  }

  renderStars(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
      arr.push(<IconStarRate key={i}/>);
    }
    return arr;
  }

  componentDidMount() {
    if (this.props.match.params.cityName) {
      this.props.setTitle('Hotels from: ' + this.props.match.params.cityName, 'hotel_listing');
    } else {
      this.props.setTitle('Hotels', 'hotel_listing');
    }
  }

  renderNotLoggedIn() {
    return (
      <div>You need to login to use this</div>
    );
  }

  renderLoggedIn() {
    const cardStyle = {
      width: 300,
      minHeight: 300,
      margin: '0.5em',
      display: 'inline-block',
      verticalAlign: 'top'
    };

    const GET_HOTELS = gql`
        query allHotels($cityId:ID, $userId: ID){
            allHotels(filter: {
                city: {
                    id: $cityId
                }
                owner: {
                    id: $userId
                }
            }) {
                id
                title
                address
                numberOfBeds
                lat
                lon
                rating
                dateOpen
                dateClose
                city {
                    id
                    name
                    population
                }
            }
        }
    `;

    const MAP_TOKEN = 'pk.eyJ1IjoiaXZhbmF0b3JhIiwiYSI6ImNpazd1dmFpbjAwMDF3MW04MjFlMXJ6czMifQ.jeVzm6JIjhsdc5MRhUsd8w';

    let user = this.auth.getUser();
    let queryVariables = {
      cityId: this.props.match.params.cityId,
      userId: user.id
    };

    return (
      <Query query={GET_HOTELS}  variables={queryVariables}>
        {({loading, error, data}) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;

          return (
            <div>
              {data.allHotels.map(row =>
                <Card style={cardStyle} key={row.id}>
                  <CardHeader title={row.title} subheader={row.city.name + ' city / pop: ' + row.city.population}/>
                  {row.image && row.image.handle ?
                    <CardMedia component="img" height="140"
                               image={'https://media.graphcms.com/' + row.image.handle}/> :
                    <CardMedia component="img" height="140" image="http://placekitten.com/300/140"/>
                  }
                  {row.lat && row.lon ?
                    <CardMedia component="img" height="140"
                               image={"https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/" + row.lon + "," + row.lat + ",14/300x140?access_token=" + MAP_TOKEN}/> :
                    <CardMedia component="img" height="140"
                               image="https://via.placeholder.com/300x140.png?text=No+map"/>
                  }
                  <CardContent style={{minHeight: 25}}>
                    {this.renderStars(row.rating)}
                  </CardContent>
                  <CardContent>Beds: {row.numberOfBeds}</CardContent>
                  <CardActions>
                    <Button color="primary" component={Link} to={"/view/" + row.id}>View</Button>
                  </CardActions>
                </Card>
              )}
            </div>

          );
        }}
      </Query>
    );
  }

  render() {
    return (
      <Paper style={{maxWidth: 1000, margin: 'auto', marginTop: 10}}>
        {this.auth.isAuthenticated() ? this.renderLoggedIn() : this.renderNotLoggedIn()}
      </Paper>
    );
  }
}

export default Listing;
