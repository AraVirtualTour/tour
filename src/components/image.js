import React, { Component } from 'react';


export default class Image extends Component {
  componentDidMount () {
    this.props.parent.loadElement();
  }

  enter () {}

  exit () {}

  render () {
    return (
      <div id={`container${this.props.id}`} className='image'>
        <div id={this.props.id}>
          {this.props.title
            ? <h1 key='title'>{this.props.title}</h1>
            : null
          }
          <img key='image' src={this.props.src} alt={this.props.alt} />
        </div>
        <div id={`padding${this.props.id}`} className='elementPadding' />
      </div>
    );
  }
}
