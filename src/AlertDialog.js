import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class AlertDialog extends React.Component {
  state = {
    open: false
  }

  handleClose = () => {
    this.props.handleClose();
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.handleClose}
        >
          <DialogTitle>{this.props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.props.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AlertDialog;
