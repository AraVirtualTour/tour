import React, { Component } from 'react';


export default class Text extends Component {
  constructor (props) {
    super(props);

    this.state = {
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

  enter () {}

  exit () {}

  render () {
    return (
      <div id={`container${this.props.id}`} className='text'>
        <div id={this.props.id}>
          {this.props.title
            ? <h1 key='title'>{this.props.title}</h1>
            : null
          }
          <p>{this.state.text}</p>
        </div>
        <div id={`padding${this.props.id}`} className='elementPadding' />
      </div>
    );
  }
}
