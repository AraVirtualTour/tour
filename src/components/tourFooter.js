import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import '../css/components.css';


export default class TourFooter extends Component {
  enableWayfinding () {
    window.sessionStorage.setItem('wayfindingEnabled', 'true');
    this.props.parent.setState({ isWayfindingEnabled: true });
  }

  disableWayfinding () {
    window.sessionStorage.setItem('wayfindingEnabled', 'false');
    this.props.parent.setState({ isWayfindingEnabled: false });
  }

  render () {
    return (
      <div id='tourFooter'>
        <Button variant='outline-secondary' className='button' onClick={() => {}}>
          To Top
        </Button>
        {!this.props.parent.state.isWayfindingEnabled
          ? <Button onClick={() => this.enableWayfinding()}>Enable Wayfinding</Button>
          : <Button onClick={() => this.disableWayfinding()}>Disable Wayfinding</Button>
        }
        <Button onClick={() => this.props.parent.props.parent.setState({ showLocations: true, showTour: false })}>List of Locations</Button>
      </div>
    );
  }
}
