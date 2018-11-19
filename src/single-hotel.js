import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import IconStarRate from '@material-ui/icons/StarRate';
import {Link} from "react-router-dom";
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class SingleHotel extends Component {
  state = {
    anchorEl: null
  }

  renderStars(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
      arr.push(<IconStarRate key={i}/>);
    }
    return arr;
  }

  handleMenuClick = event => {
    this.setState({anchorEl: event.currentTarget});
  };
  handleMenuClose = () => {
    this.setState({anchorEl: null});
  };

  render() {
    const cardStyle = {
      width: 600,
      minHeight: 300,
      margin: '0.5em',
      display: 'inline-block',
      verticalAlign: 'top'
    };

    const MAP_TOKEN = 'pk.eyJ1IjoiaXZhbmF0b3JhIiwiYSI6ImNpazd1dmFpbjAwMDF3MW04MjFlMXJ6czMifQ.jeVzm6JIjhsdc5MRhUsd8w';
    const {row} = this.props;
    const {anchorEl} = this.state;

    return (
      <Card style={cardStyle} key={row.id}>
        <CardHeader
          title={row.title}
          subheader={row.city.name + ' city / pop: ' + row.city.population}
          action={
            <div>
              <IconButton
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleMenuClick}
              >
                <MoreVertIcon/>
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleMenuClose}
              >
                <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
                <MenuItem onClick={this.handleMenuClose}>Logout</MenuItem>
              </Menu>
            </div>
          }
        />
        <Grid container>
          <Grid item xs={6}>
            {row.image && row.image.handle ?
              <CardMedia component="img" height="200"
                         image={'https://media.graphcms.com/' + row.image.handle}/> :
              <CardMedia component="img" height="200"
                         image="https://via.placeholder.com/300x200.png?text=Missing+image"/>
            }
          </Grid>
          <Grid item xs={6}>
            {row.lat && row.lon ?
              <CardMedia component="img" height="200"
                         image={"https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/" + row.lon + "," + row.lat + ",14/300x200?access_token=" + MAP_TOKEN}/> :
              <CardMedia component="img" height="200"
                         image="https://via.placeholder.com/300x200.png?text=No+map"/>
            }
          </Grid>
          <Grid item xs={6}>
            <CardContent style={{minHeight: 25}}>
              {this.renderStars(row.rating)}
            </CardContent>
            <CardContent>Beds: {row.numberOfBeds}</CardContent>
          </Grid>
          <Grid item xs={6}>
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
          </Grid>
        </Grid>
        <CardActions>
          <Button color="primary" component={Link} to="/">Back</Button>
        </CardActions>
      </Card>
    )
  }
}

export default SingleHotel;