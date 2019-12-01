import React from 'react';

import RequiredPoint from './requiredPoint';


export default class Panorama extends React.Component {
  renderRequired () {
    if (this.props.required) {
      return <RequiredPoint />;
    }
  }

  render () {
    return (
      <div id={this.props.id} className='panorama requiredPointFlex'>
        <img src={this.props.src} alt={this.props.alt} />
        {this.renderRequired()}
      </div>
    );
  }
}
