import React, { Component } from 'react';

import '../css/components.css';


export default class Panorama extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  componentDidMount () {
    this.props.parent.loadElement();
  }

  toggleOpen () {
    if (this.state.isOpen) {
      this.onClose();
    } else {
      this.onOpen();
    }
  }

  onOpen () {
    this.setState({ isOpen: true });
    document.getElementById(this.props.id).classList.add('fullscreen');
  }

  onClose () {
    this.setState({ isOpen: false });
    document.getElementById(this.props.id).classList.remove('fullscreen');
  }
  
  render () {
    return (
      <div id={`container${this.props.id}`} className='panorama'>
        <div id={this.props.id}>
          {this.props.title
            ? <h1>{this.props.title}</h1>
            : null
          }
          <div>
            <img src={this.props.src} alt={this.props.alt} />
          </div>
        </div>
        <div id={`padding${this.props.id}`} className='elementPadding' />
      </div>
    );
  }
}
