import React from 'react';
import Button from 'react-bootstrap/Button';

import LocationList from './locationList';


export default class FinishedWindow extends React.Component {
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
      <div id='finishedWindow'>
        {this.state.showLocations ? <LocationList locationsData={this.props.locationsData} /> : null}
        {this.state.showWayfinding
          ? <div id='finishedWindowWayfinding'>
              <h1>{`${this.props.reachedBottom ? 'Continue': 'Take the Tour'} With Wayfinding`}</h1>
              <p>Instructions here</p>
            </div>
          : null}
        <div id='finishedWindowNoWayfinding'>
        {!this.state.showWayfinding
          ? <Button onClick={() => this.enableWayfinding()}>Enable Wayfinding</Button>
          : <Button onClick={() => this.disableWayfinding()}>Disable Wayfinding</Button>}
          <hr />
          <h1>{`${this.props.reachedBottom ? 'Continue': 'Take the Tour'} Without Wayfinding`}</h1>
          <Button onClick={() => this.setState({ showLocations: true })}>List of Locations</Button>
        </div>
        {this.props.reachedBottom ? (
          <Button variant='outline-secondary' className='button' onClick={() => window.location.reload()}>
            Back to Top
          </Button>
        ) : null}
      </div>
    );
  }
}
