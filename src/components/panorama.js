import React from "react";

export default class Panorama extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      panoramaElement: (
        <img key="image" src={this.props.src} alt={this.props.alt} />
      )
    };
  }
  render() {
    return (
      <div id={this.props.id} className="panorama">
        {this.props.title
          ? [
              <h1 key="title">{this.props.title}</h1>,
              this.state.panoramaElement
            ]
          : this.state.panoramaElement}
      </div>
    );
  }
}
