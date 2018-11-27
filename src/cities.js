import React, {Component} from 'react';
import {gql} from 'apollo-boost';
import {Query, Mutation, Subscription} from "react-apollo";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Redirect} from "react-router-dom";
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SimpleDialog from './simple-dialog';
import TablePaginationActionsWrapped from './table-pagination';


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class Cities extends Component {
  state = {
    page: 0,
    rowsPerPage: 5,
    redirectToCity: null,
    getQueryVariables: {
      first: 5, //this.state.rowsPerPage,
      skip: 0, //this.state.page * this.state.rowsPerPage
    },
    snackbarAddedOpen: false
  }

  handleChangePage = (event, page) => {
    this.setState({
      page: page,
      getQueryVariables: {
        first: this.state.rowsPerPage,
        skip: page * this.state.rowsPerPage
      }
    });
  };

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: event.target.value,
      getQueryVariables: {
        first: event.target.value,
        skip: this.state.page * event.target.value
      }
    });
  };

  handleSearchClick = (city) => {
    this.setState({redirectToCity: city});
  }

  handleSubmit = (event, callback) => {
    let variables = {
      name: event.target.elements.name.value,
      population: parseInt(event.target.elements.population.value),
    };
    callback({
      variables: variables,
      refetchQueries: [
        {
          query: this.GET_CITIES,
          variables: this.state.getQueryVariables
        }
      ]
    });
    this.setState({snackbarAddedOpen: true});
    document.getElementById("form-add-city").reset();

  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({snackbarAddedOpen: false});
  }

  GET_CITIES = gql`
      query cities($first: Int, $skip: Int) {
          allCities(orderBy: name_ASC, first: $first, skip: $skip) {
              id
              name
              population
              _hotelsMeta {
                  count
              }
          }
          _allCitiesMeta {
              count
          }
      }
`;

  CREATE_CITY = gql`
      mutation createCity($name:String!, $population:Int){
          createCity(
              name:$name
              population:$population
          ) {
              id, name, population
          }
      }

`;
  SUBSCRIPTION_NEW_CITY = gql`
      subscription newCity {
          City(filter: {mutation_in: [CREATED]}) {
              mutation
              node {
                  id
                  name
              }
              updatedFields
          }
      }
  `;

  componentDidMount() {
    this.props.setTitle('Cities', 'city_listing');
  }

  render() {
    if (this.state.redirectToCity) {
      return <Redirect to={"/listing/" + this.state.redirectToCity.id + '/' + this.state.redirectToCity.name}/>
    }

    const {rowsPerPage, page} = this.state;

    return (
      <Paper style={{maxWidth: 1000, margin: 'auto', marginTop: 10}}>
        {/*<Subscription subscription={this.SUBSCRIPTION_NEW_CITY}>*/}
          {/*{({ data, loading}) => {*/}
            {/*console.log('subscription', data, loading);*/}
            {/*if (typeof data === 'undefined' || typeof data.City === 'undefined') {*/}
              {/*return null;*/}
            {/*} else {*/}
              {/*return (*/}
                {/*<SimpleDialog msg={`New city: ${data.City.node.name}`}/>*/}
              {/*);*/}
            {/*}*/}
          {/*}}*/}
        {/*</Subscription>*/}


        <Query query={this.GET_CITIES} variables={this.state.getQueryVariables}>
          {({loading, error, data}) => {
            if (loading) return "Loading...";
            if (error) return "Error: " + error.message;

            return (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell numeric>Population</TableCell>
                    <TableCell numeric>Num. Hotels</TableCell>
                    <TableCell>Filter</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow style={{background: 'cornsilk'}}>
                    <TableCell>
                      <b>New city</b>
                    </TableCell>
                    <TableCell colSpan={3}>
                      <Mutation mutation={this.CREATE_CITY}>
                        {(createCity, {data}) => (
                          <form id="form-add-city" onSubmit={(e) => {
                            e.preventDefault();
                            this.handleSubmit(e, createCity)
                          }}>
                            <Input placeholder="Name" name="name" style={{marginRight: 10}} required/>
                            <Input placeholder="Population" name="population" style={{marginRight: 10}} type="number"
                                   required/>
                            <Button color="primary" variant="contained" type="submit">Save</Button>
                          </form>
                        )}
                      </Mutation>
                    </TableCell>
                  </TableRow>

                  {data.allCities.map(row =>
                    <TableRow key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell numeric>{row.population}</TableCell>
                      <TableCell numeric>{row._hotelsMeta.count}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => this.handleSearchClick(row)}
                          aria-label="Search"
                        >
                          <SearchIcon/>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[3, 5, 10]}
                      colSpan={4}
                      count={data._allCitiesMeta.count}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActionsWrapped}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            );
          }}
        </Query>

        <Snackbar open={this.state.snackbarAddedOpen}
                  autoHideDuration={3000}
                  onClose={this.handleSnackbarClose}
        >
          <SnackbarContent style={{backgroundColor: '#43a047'}} message={
            <span style={{display: 'flex', alignItems: 'center'}}>
            <CheckCircleIcon/>
              Item added!
            </span>
          }/>
        </Snackbar>
      </Paper>
    );
  }
}

Cities.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Cities);