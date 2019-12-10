import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import './css/landingPage.css';


export default class LandingPage extends Component {
  openTour () {
    if (window.location.pathname.substring(1)) {
      this.props.parent.setState({showTour: true});
    } else {
      this.props.parent.setState({showLocations: true});
    }
  }

  render() {
    return (
      <div id='landingPage'>
        <Button variant='outline-secondary' className='button' onClick={() => this.openTour()}>
          <p>Tour</p>
        </Button>
        <Button variant='outline-secondary' className='button' href='/defend'>
          <p>Game</p>
        </Button>
      </div>
    );
  }
}
