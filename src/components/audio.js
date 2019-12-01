import React from 'react';

import RequiredPoint from './requiredPoint';


export default class Audio extends React.Component {
  renderRequired () {
    if (this.props.required) {
      return <RequiredPoint />;
    }
  }

  render () {
    return (
      <div id={this.props.id} className='audio requiredPointFlex'>
        <audio src={this.props.src} type={this.props.type} controls />
        {this.renderRequired()}
      </div>
    );
  }
}
