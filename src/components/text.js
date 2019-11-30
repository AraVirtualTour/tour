import React from 'react';


export default class Text extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      text: ''
    };
  }
  
  componentDidMount () {
    fetch(this.props.src)
      .then(response => response.text())
      .then((response) => this.setState({text: response}));
  }

  render () {
    return (
      <div id={this.props.id}>
        <h1>{this.props.title}</h1>
        <p>{this.state.text}</p>
      </div>
    );
  }
}
