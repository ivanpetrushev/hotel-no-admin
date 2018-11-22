import React, {Component} from 'react';
import {gql} from 'apollo-boost';
import {Query} from "react-apollo";
import Paper from '@material-ui/core/Paper';
import SingleHotel from "./single-hotel";

class Viewer extends Component {
  componentDidMount(){
    this.props.setTitle('Hotel / View', 'hotel_listing');
  }

  render() {
    const GET_SINGLE_HOTEL = gql`
        query allHotels($id:ID){
            allHotels(filter:{id:$id}) {
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

    return (
      <Paper style={{maxWidth: 1000, margin: 'auto', marginTop: 10}}>
        <Query query={GET_SINGLE_HOTEL} variables={{id: this.props.match.params.id}}>
          {({loading, error, data}) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            return <SingleHotel row={data.allHotels[0]}/>
          }}
        </Query>
      </Paper>
    );
  }
}

export default Viewer;
