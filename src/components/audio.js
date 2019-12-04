import React from 'react';


export default class Audio extends React.Component {
  render () {
    return (
      <div id={this.props.id} className='audio'>
        {this.props.title ? [<h1 key='title'>{this.props.title}</h1>,
                            <audio key='audio' src={this.props.src} type={this.props.type} controls />] :
                            <audio src={this.props.src} type={this.props.type} controls />}
      </div>
    );
  }
}
