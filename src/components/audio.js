import React from 'react';


export default class Audio extends React.Component {
  render () {
    return (
      <div id={this.props.id}>
        <audio src={this.props.src} type={this.props.type} controls />
      </div>
    );
  }
}
