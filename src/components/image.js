import React from 'react';


export default class Image extends React.Component {
  render () {
    return (
      <div id={this.props.id}>
        <img src={this.props.src} alt={this.props.alt} />
      </div>
    );
  }
}
