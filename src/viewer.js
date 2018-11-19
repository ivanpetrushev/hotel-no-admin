import React, {Component} from 'react';
import ApolloClient, {gql} from 'apollo-boost';
import {Query} from "react-apollo";
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import IconStarRate from '@material-ui/icons/StarRate';
import {Link} from "react-router-dom";
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

class Viewer extends Component {
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

  render() {
    const cardStyle = {
      width: 300,
      minHeight: 300,
      margin: '0.5em',
      display: 'inline-block',
      verticalAlign: 'top'
    };

    const client = new ApolloClient({
      uri: 'https://api-euwest.graphcms.com/v1/cjo8axbur5jsp01gl5slsksbm/master',
      request: operation => {
        operation.setContext({
          headers: {
            authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoxLCJ0b2tlbklkIjoiZGJkZGU5ODUtNjNhNi00NzA0LWI4ZDUtNmUyNGVmMmRiYTc2In0.zGQRTQhkH8QOeEyZJGqrLWBtpMlZg3UYr_XG_xRyhJM`,
          },
        });
      },
    });

    const GET_SINGLE_HOTEL = gql`
        query hotels($id: ID){
            hotels(where:{id:$id}){
                id, title, address, numberOfBeds, lat, lon, rating, dateOpen, dateClose,
                city {
                    id, name, population
                },
                image {
                    id, fileName, width, height, handle
                }
            }
        }
    `;

    const MAP_TOKEN = 'pk.eyJ1IjoiaXZhbmF0b3JhIiwiYSI6ImNpazd1dmFpbjAwMDF3MW04MjFlMXJ6czMifQ.jeVzm6JIjhsdc5MRhUsd8w';

    return (
      <Paper style={{maxWidth: 1000, margin: 'auto'}}>
        <Query query={GET_SINGLE_HOTEL} client={client} variables={{id: this.props.match.params.id}}>
          {({loading, error, data}) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            return (
              <div>
                {data.hotels.map(row =>
                  <Card style={cardStyle} key={row.id}>
                    <CardHeader title={row.title} subheader={row.city.name + ' city / pop: ' + row.city.population}/>
                    {row.image && row.image.handle ?
                      <CardMedia component="img" height="140"
                                 image={'https://media.graphcms.com/' + row.image.handle}/> :
                      <CardMedia component="img" height="140" image="https://via.placeholder.com/300x140.png?text=?"/>
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
                    {row.dateOpen ?
                      <CardContent>Date Open: {new Date(row.dateOpen).toLocaleDateString()}</CardContent>
                      :
                      <CardContent>Date Open: Unknown</CardContent>
                    }
                    {row.dateClose ?
                      <CardContent>Date Close: {new Date(row.dateClose).toLocaleDateString()}</CardContent>
                      :
                      <CardContent>Date Close: Unknown</CardContent>
                    }
                    <CardActions>
                      <Button color="primary" component={Link} to="/">Back</Button>
                    </CardActions>
                  </Card>
                )}
              </div>

            );
          }}
        </Query>
      </Paper>
    );
  }
}

export default Viewer;
