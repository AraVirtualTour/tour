import React from 'react';
import Button from 'react-bootstrap/Button';

import './css/landingPage.css';


export default class LandingPage extends React.Component {
  render () {
    return (
      <div className='LandingPage'>
        <Button variant='outline-secondary' className='button' href='/tour'><p>Tour</p></Button>
        <Button variant='outline-secondary' className='button' href='/game'><p>Game</p></Button>
      </div>
    );
  }
}
