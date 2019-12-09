import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import LocationList from './locationList';


export default class FinishedDialog extends Component {
  constructor (props) {
    super(props);

    this.state = {
      showLocations: false,
      showWayfinding: false
    };
  }

  componentDidMount () {
    this.setState({ showWayfinding: JSON.parse(window.sessionStorage.getItem('wayfindingEnabled')) })
  }

  enableWayfinding () {
    window.sessionStorage.setItem('wayfindingEnabled', 'true');
    this.setState({ showWayfinding: true });
  }

  disableWayfinding () {
    window.sessionStorage.setItem('wayfindingEnabled', 'false');
    this.setState({ showWayfinding: false });
  }

  render () {
    return (
      <div id='finishedDialog'>
        {this.state.showLocations
          ? <LocationList locationsData={this.props.locationsData} />
          : null
        }
        <h1>Continue With Wayfinding</h1>
        {this.state.showWayfinding
          ? <div id='finishedDialogWayfinding'>
              <p>Instructions here for {this.props.currentLocation}</p>
            </div>
          : null
        }
        <div id='finishedDialogNoWayfinding'>
          {!this.state.showWayfinding
            ? <Button onClick={() => this.enableWayfinding()}>Enable Wayfinding</Button>
            : <Button onClick={() => this.disableWayfinding()}>Disable Wayfinding</Button>
          }
          <hr />
          <h1>Continue Without Wayfinding</h1>
          <Button onClick={() => this.setState({ showLocations: true })}>List of Locations</Button>
        </div>
        <Button variant='outline-secondary' className='button' onClick={() => window.location.reload()}>
          Back to Top
        </Button>
      </div>
    );
  }
}
