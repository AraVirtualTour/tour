import React, { Component } from 'react';

import '../css/components.css';


export default class Text extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      text: ''
    };
  }

  componentDidMount () {
    fetch(this.props.src)
      .then(response => response.text())
      .then(text => this.setState({ text: text })
    );

    this.props.parent.loadElement();
  }

  onOpen () {
    this.setState({ isOpen: true });
  }

  onClose () {
    this.setState({ isOpen: false });
  }

  render () {
    return (
      <div id={`container${this.props.id}`} className='text'>
        <div id={this.props.id}>
          {this.props.title
            ? <h1>{this.props.title}</h1>
            : null
          }
          <p>{this.state.text}</p>
        </div>
        <div id={`padding${this.props.id}`} className='elementPadding' />
      </div>
    );
  }
}
