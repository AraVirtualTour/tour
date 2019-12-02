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
        <div>
          {this.props.title ? [<h1>{this.props.title}</h1>,
                              <img src={this.props.src} alt={this.props.alt} />] :
                              <img src={this.props.src} alt={this.props.alt} />}
        </div>
        {this.renderRequired()}
      </div>
    );
  }
}
