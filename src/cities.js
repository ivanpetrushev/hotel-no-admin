import React, {Component} from 'react';
import {gql} from 'apollo-boost';
import {Query, Mutation} from "react-apollo";
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
import FirstPageIcon from '@material-ui/icons/FirstPage';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Redirect} from "react-router-dom";

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const {classes, count, page, rowsPerPage} = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          <FirstPageIcon/>
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          <KeyboardArrowLeft/>
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          <KeyboardArrowRight/>
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          <LastPageIcon/>
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, {withTheme: true})(
  TablePaginationActions,
);

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
    }
  }

  handleChangePage = (event, page) => {
    this.setState({
      page: page,
      getQueryVariables: {
        first: this.state.rowsPerPage,
        skip: this.state.page * this.state.rowsPerPage
      }
    });
  };

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: event.target.value,
      getQueryVariables: {
        first: this.state.rowsPerPage,
        skip: this.state.page * this.state.rowsPerPage
      }
    });
  };

  handleSearchClick = (city) => {
    this.setState({redirectToCity: city});
  }

  handleSubmit = (event, callback) => {
    let variables = {
      name: event.target.elements.name.value,
      population: event.target.elements.population.value,
    };
    console.log('variables', variables)
    callback({
      variables: variables,
      refetchQueries: [
        {
          query: this.GET_CITIES,
          variables: this.state.getQueryVariables
        }
      ]
    });
  }

  GET_CITIES = gql`
    query cities($first:Int, $skip: Int){
        citiesConnection(orderBy:name_ASC, first: $first, skip: $skip) {
            edges {
                node {
                    id
                    name
                    population
                }
            }
        }
        allCitiesWithCount: citiesConnection {
            aggregate {
                count
            }
        }
    }
`;

  CREATE_CITY = gql`
    mutation createCity($name:String!, $population:Int){
        createCity(data: {name: $name, population: $population}) {
            id
            name
            population
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
                          <form onSubmit={(e) => {
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

                  {data.citiesConnection.edges.map(row =>
                    <TableRow key={row.node.id}>
                      <TableCell>{row.node.name}</TableCell>
                      <TableCell numeric>{row.node.population}</TableCell>
                      <TableCell numeric>Unknown</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => this.handleSearchClick(row.node)}
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
                      count={data.allCitiesWithCount.aggregate.count}
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
      </Paper>
    );
  }
}

Cities.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Cities);