import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import '../css/components.css';


export default class LocationList extends Component {
  openTour (location) {
    window.sessionStorage.setItem('visited', 'true');
    window.location.pathname = location;
  }

  renderList () {
    let renderedContent = [];

    for (let location of this.props.locationsData) {
      renderedContent.push(
        <Button key={location.name} onClick={() => this.openTour(location.name)}>
          {location.name}
        </Button>
      );
    }

    return renderedContent;
  }
  
  render () {
    return (
      <div id='locationList'>
        {this.renderList()}
      </div>
    );
  }
}
