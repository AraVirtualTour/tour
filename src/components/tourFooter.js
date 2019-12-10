import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import '../css/components.css';


export default class TourFooter extends Component {
  enableWayfinding () {
    window.sessionStorage.setItem('wayfindingEnabled', 'true');
    this.props.parent.props.parent.setState({ wayfindingEnabled: true });
  }

  disableWayfinding () {
    window.sessionStorage.setItem('wayfindingEnabled', 'false');
    this.props.parent.setState({ wayfindingEnabled: false });
    this.props.parent.props.parent.setState({ wayfindingEnabled: false });
  }

  show () {
    if (this.props.parent.props.parent.state.wayfindingEnabled) {
      this.props.parent.props.parent.setState({ showLocations: false, showTour: false, showWayfinding: true });
    } else {
      this.props.parent.props.parent.setState({ showLocations: true, showTour: false, showWayfinding: false });
    }    
  }

  render () {
    return (
      <div id='tourFooter'>
        <Button variant='outline-primary' className='button' onClick={() => this.props.parent.start()}>
          To Top
        </Button>
        {!this.props.parent.props.parent.state.wayfindingEnabled
          ? <Button variant='outline-primary' onClick={() => this.enableWayfinding()}>Enable Wayfinding</Button>
          : <Button variant='outline-primary' onClick={() => this.disableWayfinding()}>Disable Wayfinding</Button>
        }
        <Button variant='outline-primary' onClick={() => this.show()}>
          {this.props.parent.props.parent.state.wayfindingEnabled
            ? 'Wayfinding Map'
            : 'List of Locations'}
          </Button>
      </div>
    );
  }
}
