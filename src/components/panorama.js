import React from 'react';


export default class Panorama extends React.Component {
  render () {
    return (
      <div id={this.props.id}>
        <img src={this.props.src} alt={this.props.alt} />
      </div>
    );
  }
}
