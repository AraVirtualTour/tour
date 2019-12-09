import React, { Component } from 'react';


export default class Panorama extends Component {
  componentDidMount () {
    this.props.parent.loadElement();
  }

  enter () {}

  exit () {}
  
  render () {
    return (
      <div id={`container${this.props.id}`} className='panorama'>
        <div id={this.props.id}>
          {this.props.title
            ? <h1 key='title'>{this.props.title}</h1>
            : null
          }
          <div>
            <img key='image' src={this.props.src} alt={this.props.alt} />
          </div>
        </div>
        <div id={`padding${this.props.id}`} className='elementPadding' />
      </div>
    );
  }
}
