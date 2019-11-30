import React from 'react';


export default class Link extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      url: ''
    };
  }

  componentDidMount () {
    fetch(this.props.src)
      .then(response => response.text())
      .then((response) => this.setState({url: response.match(/http.*/)}));
  }

  render () {
    return (
      <div id={this.props.id}>
        <a href={this.state.url} target='_blank' rel="noopener noreferrer">{this.props.text}</a>
      </div>
    );
  }
}
