import React from 'react';

import RequiredPoint from './requiredPoint';


export default class Audio extends React.Component {
  renderRequired () {
    if (this.props.required) {
      return <RequiredPoint id={this.props.id} />;
    }
  }

  render () {
    return (
      <div id={this.props.id} className='audio requiredPointFlex'>
        <div>
          {this.props.title ? [<h1 key='title'>{this.props.title}</h1>,
                              <audio key='audio' src={this.props.src} type={this.props.type} controls />] :
                              <audio src={this.props.src} type={this.props.type} controls />}
        </div>
        {this.renderRequired()}
      </div>
    );
  }
}
