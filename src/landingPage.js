import React from 'react';
import Button from 'react-bootstrap/Button';

import bg from './bg.png';
import './css/landingPage.css';


export default class LandingPage extends React.Component {
  render () {
    return (
      <div className='LandingPage'>
        <img id='bg' src={bg} alt='background'></img>
        <Button variant='outline-secondary' className='button' href='/tour'><p>Tour</p></Button>
        <Button variant='outline-secondary' className='button' href='/game'><p>Game</p></Button>
      </div>
    );
  }
}
