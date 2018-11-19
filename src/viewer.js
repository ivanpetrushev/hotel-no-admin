import React, {Component} from 'react';
import ApolloClient, {gql} from 'apollo-boost';
import {Query} from "react-apollo";
import Paper from '@material-ui/core/Paper';
import SingleHotel from "./single-hotel";

class Viewer extends Component {
  render() {
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

    return (
      <Paper style={{maxWidth: 1000, margin: 'auto'}}>
        <Query query={GET_SINGLE_HOTEL} client={client} variables={{id: this.props.match.params.id}}>
          {({loading, error, data}) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            return <SingleHotel row={data.hotels[0]}/>
          }}
        </Query>
      </Paper>
    );
  }
}

export default Viewer;
