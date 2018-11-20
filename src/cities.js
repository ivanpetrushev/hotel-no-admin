import React, {Component} from 'react';
import ApolloClient, {gql} from 'apollo-boost';
import {Query} from "react-apollo";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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
import {BrowserRouter as Router, Link, Route, Redirect} from "react-router-dom";


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
    const {classes, count, page, rowsPerPage, theme} = this.props;

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
    redirectToCity: null
  }

  handleChangePage = (event, page) => {
    this.setState({page});
  };

  handleChangeRowsPerPage = event => {
    this.setState({rowsPerPage: event.target.value});
  };

  handleSearchClick = (city) => {
    console.log('a sq', city)
    this.setState({redirectToCity: city});
  }

  componentDidMount() {
    this.props.setTitle('Cities');
  }

  render() {
    if (this.state.redirectToCity) {
      return <Redirect to={"/listing/" + this.state.redirectToCity.id + '/' + this.state.redirectToCity.name}/>
    }

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

    const GET_CITIES = gql`
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

    const {rowsPerPage, page} = this.state;

    return (
      <Paper style={{maxWidth: 1000, margin: 'auto'}}>
        <Query query={GET_CITIES} client={client} variables={{first: rowsPerPage, skip: page * rowsPerPage}}>
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
// export default Cities;