import React, {Component} from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

class SimpleDialog extends Component {
  state = {
    open: true
  }
  onBtnClick = () => {
    this.setState({open: false});
  }

  render() {
    const {msg} = this.props;

    return (
      <Dialog open={this.state.open}>
        <DialogTitle>Dialog Title Here!</DialogTitle>
        <div style={{width: 150, margin: 'auto'}}>{msg}</div>
        <Button onClick={this.onBtnClick}>Close</Button>
      </Dialog>
    );
  }
}

export default SimpleDialog;