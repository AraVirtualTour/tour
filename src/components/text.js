import React from "react";

export default class Text extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ""
    };
  }

  componentDidMount() {
    fetch(this.props.src)
      .then(response => response.text())
      .then(text => this.setState({ text: text }));
  }

  render() {
    return (
      <div id={this.props.id} className="text">
        {this.props.title ? (
          [
            <h1 key="title">{this.props.title}</h1>,
            <p key="text">{this.state.text}</p>
          ]
        ) : (
          <p>{this.state.text}</p>
        )}
      </div>
    );
  }
}
