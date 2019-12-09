import React, { Component } from 'react';

import '../css/loadingScreen.css';


export default class LoadingScreen extends Component {
  render () {
    return (
      <div id='loadingScreen'>
        <div className='loader' />
        <p>Loading... {this.props.text}</p>
      </div>
    );
  }
}
