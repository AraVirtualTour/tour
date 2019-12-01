import React from 'react';

import RequiredPoint from './requiredPoint';


export default class Image extends React.Component {
  renderRequired () {
    if (this.props.required) {
      return <RequiredPoint />;
    }
  }

  render () {
    return (
      <div id={this.props.id} className='image requiredPointFlex'>
        <img src={this.props.src} alt={this.props.alt} />
        {this.renderRequired()}
      </div>
    );
  }
}
