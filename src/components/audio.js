import React from "react";

import Subtitle from "./subtitle";

export default class Audio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      audioElement: (
        <audio
          key="audio"
          id={`audio${this.props.id}`}
          src={this.props.src}
          type={this.props.type}
        />
      )
    };
  }

  componentDidMount() {
    if (this.props.subtitleData) {
      console.log(this.props.subtitleData);
    }
  }

  start() {}

  stop() {}

  render() {
    return (
      <div id={this.props.id} className="audio">
        {this.props.title
          ? [<h1 key="title">{this.props.title}</h1>, this.state.audioElement]
          : this.state.audioElement}
        {this.props.subtitleData ? (
          <Subtitle
            onRef={ref => (this.child = ref)}
            id={this.props.subtitleData.id}
            src={this.props.subtitleData.src}
          />
        ) : null}
      </div>
    );
  }
}
