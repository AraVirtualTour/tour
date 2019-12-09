import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import { LocationList } from './components';

import './css/landingPage.css';


export default class LandingPage extends Component {
  constructor (props) {
    super(props);

    this.state = {
      showLocations: false
    };
  }

  render() {
    return (
      <div id='landingPage'>
        {this.state.showLocations
          ? <LocationList locationsData={this.props.locationsData} />
          : null
        }
        <Button variant='outline-secondary' className='button' onClick={() => this.setState({ showLocations: true })}>
          <p>Tour</p>
        </Button>
        <Button variant='outline-secondary' className='button' href='/defend'>
          <p>Game</p>
        </Button>
      </div>
    );
  }
}
