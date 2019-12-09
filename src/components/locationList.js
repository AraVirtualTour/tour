import React, { Component } from 'react';


export default class LocationList extends Component {
  renderList () {
    let renderedContent = [];

    for (let location of this.props.locationsData) {
      renderedContent.push(
        <a key={location.name} href={`/${location.name}`} onClick={() => window.sessionStorage.setItem('wayfindingEnabled', 'false')}>
          {location.name}
        </a>
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
