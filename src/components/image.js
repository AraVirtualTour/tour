import React, { Component } from 'react';

import '../css/components.css';


export default class Image extends Component {
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

    for (let child of document.getElementById(this.props.id).childNodes) {
      if (child.tagName === 'IMG' && child.width > child.height + 50) {
        document.getElementById(this.props.id).classList.add('rotate');
      }
    }
  }

  onClose () {
    this.setState({ isOpen: false });
    document.getElementById(this.props.id).classList.remove('fullscreen');

    for (let child of document.getElementById(this.props.id).childNodes) {
      if (child.tagName === 'IMG' && child.width > child.height + 50) {
        document.getElementById(this.props.id).classList.remove('rotate');
      }
    }
  }

  render () {
    return (
      <div id={`container${this.props.id}`} className='image' onClick={() => this.toggleOpen()}>
        <div id={this.props.id}>
          {this.props.title
            ? <h1>{this.props.title}</h1>
            : null
          }
          <img src={this.props.src} alt={this.props.alt} />
        </div>
        <div id={`padding${this.props.id}`} className='elementPadding' />
      </div>
    );
  }
}
